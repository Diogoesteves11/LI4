using System.Net.Http.Json;
using MobiFix.API.Models.Stocks;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class PecaRepository : IPecaRepository
{
    private readonly HttpClient _http;

    public PecaRepository(HttpClient http) => _http = http;

    public async Task<Peca?> GetByEAN(string EAN)
    {
        string url = $"api/Peca?$filter=CodigoEAN eq '{EAN}'";
        var request = new HttpRequestMessage(HttpMethod.Get, url);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        var resultado = await response.Content.ReadFromJsonAsync<DabResponse<PecaDto>>();
        var dados = resultado?.Value?.FirstOrDefault();
        if (dados == null) return null;

        return new Peca(
            dados.CodigoEAN, dados.Descricao ?? "", dados.Nome,
            dados.StockAtual, (float)dados.PVP, (float)dados.CustoAquisicao,
            dados.StockMinimo, dados.PadraoReposicao
        );
    }

    public async Task<List<PecaDto>> GetAllAsync()
    {
        string url = "api/Peca?$filter=Ativo eq true";
        var request = new HttpRequestMessage(HttpMethod.Get, url);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return new();

        var resultado = await response.Content.ReadFromJsonAsync<DabResponse<PecaDto>>();
        return resultado?.Value ?? new();
    }

    public async Task<bool> AtualizarDadosParcial(string EAN, object dados)
    {
        var pecaId = await GetPecaIdByEanAsync(EAN);
        if (pecaId == null) return false;

        string urlPatch = $"api/Peca/PecaID/{pecaId}";
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), urlPatch);
        request.Content = JsonContent.Create(dados);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> AtualizarStock(string EAN, int stock)
        => await AtualizarDadosParcial(EAN, new { StockAtual = stock });

    public async Task<bool> DesativarPeca(string EAN)
        => await AtualizarDadosParcial(EAN, new { Ativo = false });

    public async Task<bool> AtivarPeca(string EAN)
        => await AtualizarDadosParcial(EAN, new { Ativo = true });

    private async Task<int?> GetPecaIdByEanAsync(string EAN)
    {
        string url = $"api/Peca?$filter=CodigoEAN eq '{EAN}'&$select=PecaID&$first=1";
        var req = new HttpRequestMessage(HttpMethod.Get, url);

        var res = await _http.SendAsync(req);
        if (!res.IsSuccessStatusCode) return null;

        var envelope = await res.Content.ReadFromJsonAsync<DabResponse<PecaDto>>();
        return envelope?.Value?.FirstOrDefault()?.PecaID;
    }
}
