namespace Backend.Services;

using System.Net.Http.Json;
using System.Text.Json;
using Backend.Models;

public class PecaService : IPecaService
{
    private readonly HttpClient _httpClient;

    private static readonly JsonSerializerOptions _optionsPascalCase = new JsonSerializerOptions
    {
        PropertyNamingPolicy = null
    };

    public PecaService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<PecaDto>> GetTodasPecasAsync()
    {
        var pecas = await _httpClient.GetFromJsonAsync<IEnumerable<PecaDto>>(
            "api/pecas",
            _optionsPascalCase
        );

        return pecas ?? Enumerable.Empty<PecaDto>();
    }

    public async Task<PecaDto?> GetPecaPorEanAsync(string ean)
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<PecaDto>(
                $"api/pecas/{ean}",
                _optionsPascalCase
            );
        }
        catch (HttpRequestException)
        {
            // Se a API Node retornar 404 (Not Found), cai aqui
            return null;
        }
    }

    public async Task<PecaDto?> CriarPecaAsync(PecaDto novaPeca)
    {
        var response = await _httpClient.PostAsJsonAsync("api/pecas", novaPeca, _optionsPascalCase);

        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content.ReadFromJsonAsync<PecaDto>(_optionsPascalCase);
    }

    public async Task<PecaDto?> AtualizarPecaAsync(string ean, PecaDto pecaAtualizada)
    {
        var response = await _httpClient.PutAsJsonAsync($"api/pecas/{ean}", pecaAtualizada, _optionsPascalCase);

        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content.ReadFromJsonAsync<PecaDto>(_optionsPascalCase);
    }

    public async Task<PecaDto?> AlterarEstadoPecaAsync(string ean, bool ativo)
    {
        var payload = new EstadoPecaDto { Ativo = ativo };
        var content = JsonContent.Create(payload, options: _optionsPascalCase);
        
        var response = await _httpClient.PatchAsync($"api/pecas/{ean}/estado", content);

        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content.ReadFromJsonAsync<PecaDto>(_optionsPascalCase);
    }

    public async Task<bool> EliminarPecaAsync(string ean)
    {
        var response = await _httpClient.DeleteAsync($"api/pecas/{ean}");
        return response.IsSuccessStatusCode;
    }
}