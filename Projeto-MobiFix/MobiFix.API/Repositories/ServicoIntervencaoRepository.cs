using System.Net.Http.Json;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class ServicoIntervencaoRepository : IServicoIntervencaoRepository
{
    private readonly HttpClient _http;

    public ServicoIntervencaoRepository(HttpClient http) => _http = http;

    public async Task<bool> AtribuirIntervencaoAsync(ServicoIntervencaoDto dto)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "api/ServicoIntervencao");
        request.Content = JsonContent.Create(dto);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> ConcluirIntervencaoAsync(int servicoId, int intervencaoId)
    {
        string url = $"api/ServicoIntervencao/ServicoID/{servicoId}/IntervencaoID/{intervencaoId}";
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), url);
        request.Content = JsonContent.Create(new { DataFim = DateTime.UtcNow });

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<List<ServicoIntervencaoDto>> ObterPorServicoAsync(int servicoId)
    {
        string url = $"api/ServicoIntervencao?$filter=ServicoID eq {servicoId}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return new();

        var result = await response.Content.ReadFromJsonAsync<DabResponse<ServicoIntervencaoDto>>();
        return result?.Value ?? new();
    }

    public async Task<bool> RegistarPecaAsync(IntervencaoPecaDto dto)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "api/IntervencaoPeca");
        request.Content = JsonContent.Create(dto);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }
}
