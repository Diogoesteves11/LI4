using System.Net.Http.Json;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class EncomendaClienteRepository : IEncomendaClienteRepository
{
    private readonly HttpClient _http;

    public EncomendaClienteRepository(HttpClient http) => _http = http;

    public async Task<EncomendaClienteDto?> CriarAsync(EncomendaClienteDto dto)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "api/EncomendaCliente");

        request.Content = JsonContent.Create(dto);

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<EncomendaClienteDto>();
    }

    public async Task<bool> AdicionarItemAsync(EncomendaClienteItemDto dto)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "api/EncomendaClienteItem");

        request.Content = JsonContent.Create(dto);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<List<EncomendaClienteDto>> ObterPorClienteAsync(int clienteId)
    {
        string url = $"api/EncomendaCliente?$filter=ClienteID eq {clienteId}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);


        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return new();

        var result = await response.Content.ReadFromJsonAsync<DabResponse<EncomendaClienteDto>>();
        return result?.Value ?? new();
    }

    public async Task<EncomendaClienteDto?> ObterPorIdAsync(int id)
    {
        string url = $"api/EncomendaCliente/EncomendaClienteID/{id}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);


        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<EncomendaClienteDto>();
    }

    public async Task<bool> AtualizarEstadoAsync(int id, string estado)
    {
        string url = $"api/EncomendaCliente/EncomendaClienteID/{id}";
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), url);

        request.Content = JsonContent.Create(new { Estado = estado });

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> AtualizarFaturaAsync(int encomendaId, int faturaId)
    {
        string url = $"api/EncomendaCliente/EncomendaClienteID/{encomendaId}";
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), url);

        request.Content = JsonContent.Create(new { FaturaID = faturaId });

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }
}
