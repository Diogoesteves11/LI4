using System.Net.Http.Json;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class NotaCreditoRepository : INotaCreditoRepository
{
    private readonly HttpClient _http;

    public NotaCreditoRepository(HttpClient http) => _http = http;

    public async Task<NotaCreditoDto?> CriarAsync(NotaCreditoDto dto)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "api/NotaCredito");
        request.Content = JsonContent.Create(dto);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<NotaCreditoDto>();
    }

    public async Task<NotaCreditoDto?> ObterPorDevolucaoAsync(int devolucaoId)
    {
        string url = $"api/NotaCredito?$filter=DevolucaoID eq {devolucaoId}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        var result = await response.Content.ReadFromJsonAsync<DabResponse<NotaCreditoDto>>();
        return result?.Value?.FirstOrDefault();
    }
}
