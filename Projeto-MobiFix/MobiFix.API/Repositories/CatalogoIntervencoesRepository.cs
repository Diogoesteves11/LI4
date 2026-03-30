using System.Net.Http.Json;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class CatalogoIntervencoesRepository : ICatalogoIntervencoesRepository
{
    private readonly HttpClient _http;

    public CatalogoIntervencoesRepository(HttpClient http) => _http = http;

    public async Task<List<IntervencaoCatalogoDto>> ObterTodosAsync()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "api/IntervencaoCatalogo");
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return new();

        var result = await response.Content.ReadFromJsonAsync<DabResponse<IntervencaoCatalogoDto>>();
        return result?.Value ?? new();
    }

    public async Task<IntervencaoCatalogoDto?> ObterPorIdAsync(int id)
    {
        string url = $"api/IntervencaoCatalogo/IntervencaoID/{id}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<IntervencaoCatalogoDto>();
    }
}
