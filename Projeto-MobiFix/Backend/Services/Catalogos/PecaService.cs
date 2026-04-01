using System.Net.Http.Json;
using Backend.Models;

public class PecaService: IPecaService
{
    private readonly HttpClient _httpClient;

    public PecaService(HttpClient httpClient){
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<PecaDto>> GetTodasPecasAsync()
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<PecaDto>>("qualquer_merda/pecas");
    }
}