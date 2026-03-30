using System.Net.Http.Json;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class FaturaRepository : IFaturaRepository
{
    private readonly HttpClient _http;

    public FaturaRepository(HttpClient http) => _http = http;

    public async Task<FaturaDto?> ObterPorIdAsync(int id)
    {
        string url = $"api/Fatura/FaturaID/{id}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<FaturaDto>();
    }

    public async Task<List<FaturaDto>> ObterPorClienteAsync(int clienteId)
    {
        string url = $"api/Fatura?$filter=ClienteID eq {clienteId}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return new();

        var result = await response.Content.ReadFromJsonAsync<DabResponse<FaturaDto>>();
        return result?.Value ?? new();
    }

    public async Task<FaturaDto?> CriarAsync(FaturaDto dto)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "api/Fatura");
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dto);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<FaturaDto>();
    }

    public async Task<List<FaturaDto>> ObterTodasAsync()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "api/Fatura");
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return new();

        var result = await response.Content.ReadFromJsonAsync<DabResponse<FaturaDto>>();
        return result?.Value ?? new();
    }
}
