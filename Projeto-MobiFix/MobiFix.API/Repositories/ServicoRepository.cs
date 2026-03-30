using System.Net.Http.Json;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class ServicoRepository : IServicoRepository
{
    private readonly HttpClient _http;

    public ServicoRepository(HttpClient http) => _http = http;

    public async Task<ServicoDto?> ObterPorIdAsync(int id)
    {
        string url = $"api/Servico/ServicoID/{id}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<ServicoDto>();
    }

    public async Task<List<ServicoDto>> ObterPorTrotineteAsync(int trotineteId)
    {
        string url = $"api/Servico?$filter=TrotineteID eq {trotineteId}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return new();

        var result = await response.Content.ReadFromJsonAsync<DabResponse<ServicoDto>>();
        return result?.Value ?? new();
    }

    public async Task<List<ServicoDto>> ObterTodosAsync()
    {
        string url = "api/Servico";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return new();

        var result = await response.Content.ReadFromJsonAsync<DabResponse<ServicoDto>>();
        return result?.Value ?? new();
    }

    public async Task<ServicoDto?> CriarAsync(ServicoDto dto)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "api/Servico");
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dto);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<ServicoDto>();
    }

    public async Task<bool> AtualizarEstadoAsync(int servicoId, string novoEstado)
    {
        return await AtualizarParcialAsync(servicoId, new { Estado = novoEstado });
    }

    public async Task<bool> AtualizarParcialAsync(int servicoId, object dados)
    {
        string url = $"api/Servico/ServicoID/{servicoId}";
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dados);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }
}
