using System.Net.Http.Json;
using Backend.Models;

namespace Backend.Services;

public class PecaService: IPecaService
{
    private readonly HttpClient _httpClient;

    public PecaService(HttpClient httpClient){
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<PecaDto>> GetTodasPecasAsync()
    {
        var resultado = await _httpClient.GetFromJsonAsync<IEnumerable<PecaDto>>("pecas/");
        return resultado ?? Enumerable.Empty<PecaDto>();
    }
}