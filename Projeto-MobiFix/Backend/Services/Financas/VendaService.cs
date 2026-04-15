namespace Backend.Services;

using System.Net.Http.Json;
using System.Text.Json;
using Backend.Models;

public class VendaService : IVendaService
{
    private readonly HttpClient _httpClient;
    private static readonly JsonSerializerOptions _options = new() { PropertyNamingPolicy = null };

    public VendaService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<VendaDto>> ListarVendasAsync()
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<VendaDto>>("api/vendas", _options)
               ?? Enumerable.Empty<VendaDto>();
    }

    public async Task<VendaDto?> ObterVendaAsync(int id)
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<VendaDto>($"api/vendas/{id}", _options);
        }
        catch { return null; }
    }

    public async Task<VendaComFaturaDto?> RegistarVendaDiretaAsync(string operadorNumero, CheckoutVendaDiretaDto dto)
    {
        // Recalcula o total no servidor a partir dos itens — não confia no frontend
        var totalCalculado = dto.ItensVenda.Sum(i => i.PrecoUnitario * i.Quantidade);

        // 1) criar a Venda (regista itens + operador autenticado)
        var vendaPayload = new
        {
            VendaID        = Random.Shared.Next(10, int.MaxValue),
            OperadorNumero = operadorNumero,
            Total          = totalCalculado,
            ItensVenda     = dto.ItensVenda.Select(i => new
            {
                PecaEAN    = i.PecaEAN,
                Quantidade = i.Quantidade
            })
        };

        var vendaResponse = await _httpClient.PostAsJsonAsync("api/vendas", vendaPayload, _options);
        if (!vendaResponse.IsSuccessStatusCode) return null;

        var venda = await vendaResponse.Content.ReadFromJsonAsync<VendaDto>(_options);
        if (venda is null) return null;

        // 2) criar a Fatura ligada à Venda
        var faturaPayload = new
        {
            NumeroFatura    = dto.NumeroFatura,
            ClienteNIF      = string.IsNullOrWhiteSpace(dto.ClienteNIF) ? "000000000" : dto.ClienteNIF,
            VendaID         = (int?)venda.VendaID,
            ValorTotal      = totalCalculado,
            MetodoPagamento = dto.MetodoPagamento
        };

        var faturaResponse = await _httpClient.PostAsJsonAsync("api/faturas", faturaPayload, _options);
        if (!faturaResponse.IsSuccessStatusCode) return null;

        var fatura = await faturaResponse.Content.ReadFromJsonAsync<FaturaDto>(_options);
        if (fatura is null) return null;

        return new VendaComFaturaDto { Venda = venda, Fatura = fatura };
    }
}
