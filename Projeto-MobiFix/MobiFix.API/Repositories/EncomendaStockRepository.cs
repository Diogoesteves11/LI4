using System.Net.Http.Json;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class EncomendaStockRepository : IEncomendaStockRepository
{
    private readonly HttpClient _http;

    public EncomendaStockRepository(HttpClient http) => _http = http;

    public async Task<EncomendaStockDto?> CriarAsync(EncomendaStockDto dto)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "api/EncomendaStock");
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dto);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<EncomendaStockDto>();
    }

    public async Task<List<EncomendaStockDto>> ObterTodasAsync()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "api/EncomendaStock");
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return new();

        var result = await response.Content.ReadFromJsonAsync<DabResponse<EncomendaStockDto>>();
        return result?.Value ?? new();
    }

    public async Task<EncomendaStockDto?> ObterPorIdAsync(int id)
    {
        string url = $"api/EncomendaStock/EncomendaID/{id}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<EncomendaStockDto>();
    }

    public async Task<bool> AtualizarEstadoAsync(int id, string estado, int? operadorRececaoId)
    {
        string url = $"api/EncomendaStock/EncomendaID/{id}";
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var dados = operadorRececaoId != null
            ? (object)new { Estado = estado, OperadorRececaoID = operadorRececaoId }
            : new { Estado = estado };

        request.Content = JsonContent.Create(dados);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }
}
