namespace Backend.Services;

using System.Net.Http.Json;
using System.Text.Json;
using Backend.Models;

public class ServicoService : IServicoService
{
    private readonly HttpClient _httpClient;
    private readonly IClienteService _clienteService;
    private readonly IEmailService _emailService;
    private static readonly JsonSerializerOptions _options = new() { PropertyNamingPolicy = null };

    public ServicoService(HttpClient httpClient, IClienteService clienteService, IEmailService emailService)
    {
        _httpClient = httpClient;
        _clienteService = clienteService;
        _emailService = emailService;
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

    public async Task<ServicoDto?> AtualizarServicoAsync(int id, ServicoAtualizacaoDto dto)
    {
        var payload = new Dictionary<string, object?>();
        if (dto.Estado is not null) payload["Estado"] = dto.Estado;
        if (dto.DescricaoDiagnostico is not null) payload["DescricaoDiagnostico"] = dto.DescricaoDiagnostico;
        if (dto.Preco is not null) payload["Preco"] = dto.Preco;
        if (dto.DataConclusao is not null) payload["DataConclusao"] = dto.DataConclusao;
        if (dto.HistoricoIntervencoes is not null)
        {
            payload["HistoricoIntervencoes"] = dto.HistoricoIntervencoes.Select(h => new
            {
                IntervencaoCatalogoID = h.IntervencaoCatalogoID,
                MecanicoNumero = h.MecanicoNumero,
                DataInicio = h.DataInicio,
                DataFim = h.DataFim,
                TempoGastoMinutos = h.TempoGastoMinutos,
                PecasUtilizadas = h.PecasUtilizadas.Select(p => new
                {
                    PecaEAN = p.PecaEAN,
                    Quantidade = p.Quantidade
                })
            });
        }

        var response = await _httpClient.PutAsJsonAsync($"api/servicos/{id}", payload, _options);
        if (!response.IsSuccessStatusCode) return null;
        var atualizado = await response.Content.ReadFromJsonAsync<ServicoDto>(_options);

        if (string.Equals(dto.Estado, "CONCLUIDO", StringComparison.OrdinalIgnoreCase) && atualizado is not null)
        {
            _ = Task.Run(() => NotificarConclusaoAsync(atualizado));
        }

        return atualizado;
    }

    private async Task NotificarConclusaoAsync(ServicoDto servico)
    {
        try
        {
            var trotinete = await _httpClient.GetFromJsonAsync<TrotineteDto>(
                $"api/trotinetes/{servico.TrotineteNumSerie}", _options);
            if (trotinete is null || string.IsNullOrWhiteSpace(trotinete.ClienteNIF)) return;

            var cliente = await _clienteService.ObterPorNifAsync(trotinete.ClienteNIF);
            if (cliente is null || string.IsNullOrWhiteSpace(cliente.Email)) return;

            await _emailService.NotificarTrotineteProntaAsync(
                cliente.Email,
                string.IsNullOrWhiteSpace(cliente.Nome) ? "Cliente" : cliente.Nome,
                servico.ServicoID,
                servico.TrotineteNumSerie,
                servico.Preco);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ServicoService] Falha ao notificar conclusão do serviço {servico.ServicoID}: {ex.Message}");
        }
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