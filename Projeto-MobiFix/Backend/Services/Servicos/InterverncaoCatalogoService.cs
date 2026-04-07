namespace Backend.Services;

using System.Net.Http.Json;
using System.Text.Json;
using Backend.Models;



public class IntervencaoCatalogoService : IIntervencaoCatalogoService
{
    private readonly HttpClient _httpClient;
    private static readonly JsonSerializerOptions _options = new() { PropertyNamingPolicy = null };

    public IntervencaoCatalogoService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<IntervencaoCatalogoDto>> ListarTodasAsync()
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<IntervencaoCatalogoDto>>("api/intervencoes-catalogo", _options) 
               ?? Enumerable.Empty<IntervencaoCatalogoDto>();
    }

    public async Task<IntervencaoCatalogoDto?> ObterPorIdAsync(string id)
    {
        try 
        {
            return await _httpClient.GetFromJsonAsync<IntervencaoCatalogoDto>($"api/intervencoes-catalogo/{id}", _options);
        }
        catch { return null; }
    }
}