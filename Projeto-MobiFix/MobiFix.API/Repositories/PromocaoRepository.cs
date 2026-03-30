using System.Net.Http.Json;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class PromocaoRepository : IPromocaoRepository
{
    private readonly HttpClient _http;

    public PromocaoRepository(HttpClient http) => _http = http;

    public async Task<PromocaoDto?> CriarAsync(PromocaoDto dto)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "api/Promocao");
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dto);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<PromocaoDto>();
    }

    public async Task<bool> AdicionarPecaPromocaoAsync(PromocaoPecaDto dto)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "api/PromocaoPeca");
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dto);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<List<PromocaoDto>> ObterTodasAsync()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "api/Promocao");
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return new();

        var result = await response.Content.ReadFromJsonAsync<DabResponse<PromocaoDto>>();
        return result?.Value ?? new();
    }

    public async Task<PromocaoDto?> ObterPorIdAsync(int id)
    {
        string url = $"api/Promocao/PromocaoID/{id}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<PromocaoDto>();
    }

    public async Task<bool> EliminarAsync(int id)
    {
        string url = $"api/Promocao/PromocaoID/{id}";
        var request = new HttpRequestMessage(HttpMethod.Delete, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }
}
