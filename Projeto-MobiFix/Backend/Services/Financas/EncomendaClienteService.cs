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
            "api/encomendas-cliente", _options
        ) ?? Enumerable.Empty<EncomendaClienteDto>();

        // Filtra pelo cliente autenticado
        return todas.Where(e => e.ClienteNIF == clienteNIF);
    }
}