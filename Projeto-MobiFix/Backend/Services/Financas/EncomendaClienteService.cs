namespace Backend.Services;

using System.Net.Http.Json;
using System.Text.Json;
using Backend.Models;

public class EncomendaClienteService : IEncomendaClienteService
{
    private readonly HttpClient _httpClient;
    private static readonly JsonSerializerOptions _options = new() { PropertyNamingPolicy = null };

    public EncomendaClienteService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<EncomendaClienteDto?> CriarEncomendaAsync(string clienteNIF, EncomendaClienteCriacaoDto dto)
    {
        // Total calculado aqui — não vem do frontend, evita manipulação de preços
        var total = dto.Itens.Sum(i => i.PrecoUnitario * i.Quantidade);

        var payload = new
        {
            EncomendaClienteID = Random.Shared.Next(10, int.MaxValue),
            ClienteNIF         = clienteNIF,
            Total              = total,
            Estado             = "PRONTO PARA LEVANTAMENTO",
            FaturaId           = (int?)null,   // só preenchido no pagamento
            Itens              = dto.Itens.Select(i => new
            {
                PecaEAN    = i.PecaEAN,
                Quantidade = i.Quantidade
            })
        };

        var response = await _httpClient.PostAsJsonAsync("api/encomendas-cliente", payload, _options);

        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<EncomendaClienteDto>(_options);
    }

    public async Task<IEnumerable<EncomendaClienteDto>> ListarEncomendasClienteAsync(string clienteNIF)
    {
        var todas = await _httpClient.GetFromJsonAsync<IEnumerable<EncomendaClienteDto>>(
            $"api/encomendas-cliente?clienteId={clienteNIF}", _options
        ) ?? Enumerable.Empty<EncomendaClienteDto>();

        return todas;
    }

    public async Task<IEnumerable<PecaReservadaDto>> ListarProntasParaLevantamentoAsync()
    {
        // Mongoose normaliza estado para UPPERCASE — "PRONTO PARA LEVANTAMENTO" é o default
        var encomendasTask = _httpClient.GetFromJsonAsync<IEnumerable<EncomendaClienteDto>>(
            "api/encomendas-cliente?estado=PRONTO PARA LEVANTAMENTO", _options);
        var pecasTask = _httpClient.GetFromJsonAsync<IEnumerable<PecaDto>>(
            "api/pecas", _options);

        await Task.WhenAll(encomendasTask, pecasTask);

        var encomendas = encomendasTask.Result ?? Enumerable.Empty<EncomendaClienteDto>();
        var pecas = (pecasTask.Result ?? Enumerable.Empty<PecaDto>())
            .ToDictionary(p => p.CodigoEAN, p => p);

        return encomendas.Select(e => new PecaReservadaDto
        {
            EncomendaClienteID = e.EncomendaClienteID,
            ClienteNIF         = e.ClienteNIF,
            DataEncomenda      = e.DataEncomenda,
            Estado             = e.Estado,
            Total              = e.Total,
            Itens              = e.Itens.Select(i =>
            {
                pecas.TryGetValue(i.PecaEAN, out var peca);
                return new ItemEncomendaDetalhadoDto
                {
                    PecaEAN       = i.PecaEAN,
                    Nome          = peca?.Nome,
                    Categoria     = peca?.Categoria,
                    Quantidade    = i.Quantidade,
                    PrecoUnitario = peca is null ? null : peca.PVP
                };
            }).ToList()
        });
    }

    public async Task<bool> MarcarComoLevantadaAsync(int id)
    {
        var payload = new { Estado = "LEVANTADA" };
        var response = await _httpClient.PutAsJsonAsync($"api/encomendas-cliente/{id}", payload, _options);
        return response.IsSuccessStatusCode;
    }
}