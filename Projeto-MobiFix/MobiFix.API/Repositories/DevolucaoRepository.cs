using System.Net.Http.Json;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class DevolucaoRepository : IDevolucaoRepository
{
    private readonly HttpClient _http;

    public DevolucaoRepository(HttpClient http) => _http = http;

    public async Task<DevolucaoDto?> CriarAsync(DevolucaoDto dto)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "api/Devolucao");
        request.Content = JsonContent.Create(dto);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<DevolucaoDto>();
    }

    public async Task<DevolucaoDto?> ObterPorIdAsync(int id)
    {
        string url = $"api/Devolucao/DevolucaoID/{id}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<DevolucaoDto>();
    }
}
