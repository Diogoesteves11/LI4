namespace Backend.Services;

using System.Net.Http.Json;
using System.Text.Json;
using Backend.Models;


public class FaturaService : IFaturaService
{
    private readonly HttpClient _httpClient;
    private readonly IPecaService _pecaService;
    private readonly IVendaService _vendaService;
    private static readonly JsonSerializerOptions _options = new() { PropertyNamingPolicy = null };

    public FaturaService(HttpClient httpClient, IPecaService pecaService, IVendaService vendaService)
    {
        _httpClient = httpClient;
        _pecaService = pecaService;
        _vendaService = vendaService;
    }

    public async Task<IEnumerable<FaturaDto>> GetFaturasAsync()
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<FaturaDto>>("api/faturas", _options) 
               ?? Enumerable.Empty<FaturaDto>();
    }

    public async Task<IEnumerable<FaturaDto>> GetFaturasCliente(string id)
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<FaturaDto>>($"api/faturas?nif={id}", _options)
            ?? Enumerable.Empty<FaturaDto>();
    }

    public async Task<FaturaDto?> GetFaturaPorNumeroAsync(string numero)
    {
        try 
        {
            return await _httpClient.GetFromJsonAsync<FaturaDto>($"api/faturas/{numero}", _options);
        }
        catch { return null; }
    }

public async Task<FaturaDto?> CriarFaturaAsync(FaturaCriacaoDto faturaDto)
    {
        var payloadNode = new
        {
            NumeroFatura = faturaDto.NumeroFatura,
            ClienteNIF = faturaDto.ClienteNIF,
            ServicoID = faturaDto.ServicoID,
            VendaID = faturaDto.VendaID,
            ValorTotal = faturaDto.ValorTotal,
            MetodoPagamento = faturaDto.MetodoPagamento
        };

        var response = await _httpClient.PostAsJsonAsync("api/faturas", payloadNode, _options);
        
        if (!response.IsSuccessStatusCode) 
            return null; 

        var faturaCriada = await response.Content.ReadFromJsonAsync<FaturaDto>(_options);

        if (faturaDto.ItensVenda != null && faturaDto.ItensVenda.Any())
        {
            foreach (var item in faturaDto.ItensVenda)
            {
                var peca = await _pecaService.GetPecaPorEanAsync(item.PecaEAN);
                
                if (peca != null)
                {
                    peca.StockAtual -= item.Quantidade;
                    if (peca.StockAtual < 0) peca.StockAtual = 0;

                    await _pecaService.AtualizarPecaAsync(item.PecaEAN, peca);
                }
            }
        }

        return faturaCriada;
    }

    public async Task<bool> EliminarFaturaAsync(string numero)
    {
        var response = await _httpClient.DeleteAsync($"api/faturas/{numero}");
        return response.IsSuccessStatusCode;
    }

    public async Task<FaturaDto?> ProcessarDevolucaoAsync(string numeroFatura, string motivo)
    {
        if (string.IsNullOrWhiteSpace(numeroFatura))
            throw new ArgumentException("Número de fatura obrigatório.", nameof(numeroFatura));
        if (string.IsNullOrWhiteSpace(motivo))
            throw new ArgumentException("Motivo da devolução obrigatório.", nameof(motivo));

        var fatura = await GetFaturaPorNumeroAsync(numeroFatura);
        if (fatura is null)
            throw new InvalidOperationException("Fatura não encontrada.");

        if (fatura.Devolucoes.Any())
            throw new InvalidOperationException("Esta fatura já foi devolvida.");

        // Reverter stock (apenas vendas têm itens de peças; serviços não reabastecem stock)
        if (fatura.VendaID.HasValue)
        {
            var venda = await _vendaService.ObterVendaAsync(fatura.VendaID.Value);
            if (venda is not null)
            {
                foreach (var item in venda.ItensVenda)
                {
                    var peca = await _pecaService.GetPecaPorEanAsync(item.PecaEAN);
                    if (peca is null) continue;
                    peca.StockAtual += item.Quantidade;
                    await _pecaService.AtualizarPecaAsync(item.PecaEAN, peca);
                }
            }
        }

        var payload = new
        {
            Devolucoes = new[]
            {
                new
                {
                    Motivo = motivo,
                    NotaCredito = new { ValorCreditado = fatura.ValorTotal }
                }
            }
        };

        var response = await _httpClient.PutAsJsonAsync(
            $"api/faturas/{Uri.EscapeDataString(numeroFatura)}", payload, _options);

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException($"Mongoose recusou a devolução: {(int)response.StatusCode}.");

        return await response.Content.ReadFromJsonAsync<FaturaDto>(_options);
    }
}
