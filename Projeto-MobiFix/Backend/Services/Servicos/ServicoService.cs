namespace Backend.Services;

using System.Net.Http.Json;
using System.Text.Json;
using Backend.Models;

public class ServicoService : IServicoService
{
    private readonly HttpClient _httpClient;
    private static readonly JsonSerializerOptions _options = new() { PropertyNamingPolicy = null };

    public ServicoService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<ServicoDto>> ListarTodosAsync()
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<ServicoDto>>("api/servicos", _options)
               ?? Enumerable.Empty<ServicoDto>();
    }

    public async Task<ServicoDto?> ObterPorIdAsync(int id)
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<ServicoDto>($"api/servicos/{id}", _options);
        }
        catch { return null; }
    }

    public async Task<ServicoDto?> CriarServicoDiagnosticoAsync(ServicoCriacaoDto dto)
    {
        var payload = new
        {
            ServicoID = Random.Shared.Next(20, 1000000),
            TrotineteNumSerie = dto.TrotineteNumSerie,
            Estado = "AGENDADO",
            FeedbackCliente = dto.FeedbackCliente,
            Preco = 0,                 
            IntervencaoInicialD = 3    
        };

        var response = await _httpClient.PostAsJsonAsync("api/servicos", payload, _options);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<ServicoDto>(_options);
    }

    public async Task<bool> AtualizarEstadoAsync(int id, string novoEstado)
    {
        var payload = new { Estado = novoEstado };
        var response = await _httpClient.PutAsJsonAsync($"api/servicos/{id}", payload, _options);
        return response.IsSuccessStatusCode;
    }

    public async Task<IEnumerable<TrotineteProntaDto>> ListarProntasAsync()
    {
        // Serviços no estado CONCLUIDO = reparação terminada, aguarda levantamento
        var servicosTask  = _httpClient.GetFromJsonAsync<IEnumerable<ServicoDto>>(
            "api/servicos?estado=CONCLUIDO", _options);
        var trotinetesTask = _httpClient.GetFromJsonAsync<IEnumerable<TrotineteDto>>(
            "api/trotinetes", _options);

        await Task.WhenAll(servicosTask, trotinetesTask);

        var servicos   = servicosTask.Result   ?? Enumerable.Empty<ServicoDto>();
        var trotinetes = (trotinetesTask.Result ?? Enumerable.Empty<TrotineteDto>())
            .ToDictionary(t => t.NumeroSerie, t => t);

        return servicos.Select(s =>
        {
            trotinetes.TryGetValue(s.TrotineteNumSerie, out var trot);
            return new TrotineteProntaDto
            {
                ServicoID            = s.ServicoID,
                TrotineteNumSerie    = s.TrotineteNumSerie,
                Marca                = trot?.Marca,
                Modelo               = trot?.Modelo,
                ClienteNIF           = trot?.ClienteNIF ?? string.Empty,
                DataAgendamento      = s.DataAgendamento,
                DataConclusao        = s.DataConclusao,
                Preco                = s.Preco,
                DescricaoDiagnostico = s.DescricaoDiagnostico
            };
        });
    }

    public async Task<bool> FecharServicoAsync(int id)
    {
        // Fechar = levantamento efetuado (estado final)
        var payload = new { Estado = "FECHADO" };
        var response = await _httpClient.PutAsJsonAsync($"api/servicos/{id}", payload, _options);
        return response.IsSuccessStatusCode;
    }

    public async Task<LevantamentoComFaturaDto?> LevantarComFaturaAsync(int id, string metodoPagamento)
    {
        // 1) obter o serviço + trotinete para extrair ClienteNIF e Preco
        var servico = await ObterPorIdAsync(id);
        if (servico is null) return null;

        var trotinete = await _httpClient.GetFromJsonAsync<TrotineteDto>(
            $"api/trotinetes/{servico.TrotineteNumSerie}", _options);
        if (trotinete is null) return null;

        var nif = string.IsNullOrWhiteSpace(trotinete.ClienteNIF) ? "000000000" : trotinete.ClienteNIF;
        var numeroFatura = $"FT-{Random.Shared.Next(100000, 999999)}";

        // 2) criar a Fatura ligada ao Serviço
        var faturaPayload = new
        {
            NumeroFatura    = numeroFatura,
            ClienteNIF      = nif,
            ServicoID       = (int?)servico.ServicoID,
            ValorTotal      = servico.Preco,
            MetodoPagamento = metodoPagamento
        };

        var faturaResponse = await _httpClient.PostAsJsonAsync("api/faturas", faturaPayload, _options);
        if (!faturaResponse.IsSuccessStatusCode) return null;

        var fatura = await faturaResponse.Content.ReadFromJsonAsync<FaturaDto>(_options);
        if (fatura is null) return null;

        // 3) fechar o serviço (estado final = FECHADO)
        var fechado = await FecharServicoAsync(id);
        if (!fechado) return null;

        return new LevantamentoComFaturaDto { Fatura = fatura };
    }
}