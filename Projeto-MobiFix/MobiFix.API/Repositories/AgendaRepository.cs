using System.Net.Http.Json;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class AgendaRepository : IAgendaRepository
{
    private readonly HttpClient _http;

    public AgendaRepository(HttpClient http) => _http = http;

    public async Task<AgendaMecanicoDto?> CriarSlotAsync(AgendaMecanicoDto dto)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "api/AgendaMecanicos");

        request.Content = JsonContent.Create(dto);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<AgendaMecanicoDto>();
    }

    public async Task<List<AgendaMecanicoDto>> ObterPorMecanicoAsync(int mecanicoId)
    {
        string url = $"api/AgendaMecanicos?$filter=MecanicoID eq {mecanicoId}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);


        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return new();

        var result = await response.Content.ReadFromJsonAsync<DabResponse<AgendaMecanicoDto>>();
        return result?.Value ?? new();
    }

    public async Task<List<AgendaMecanicoDto>> ObterPorServicoAsync(int servicoId)
    {
        string url = $"api/AgendaMecanicos?$filter=ServicoID eq {servicoId}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);


        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return new();

        var result = await response.Content.ReadFromJsonAsync<DabResponse<AgendaMecanicoDto>>();
        return result?.Value ?? new();
    }

    public async Task<bool> AtualizarEstadoAsync(int agendaId, string estado)
    {
        string url = $"api/AgendaMecanicos/AgendaID/{agendaId}";
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), url);

        request.Content = JsonContent.Create(new { Estado = estado });

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }
}
