namespace Backend.Services;

using System.Net.Http.Json;
using System.Text.Json;
using Backend.Models;


public class FaturaService : IFaturaService
{
    private readonly HttpClient _httpClient;
    private static readonly JsonSerializerOptions _options = new() { PropertyNamingPolicy = null };

    public FaturaService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<FaturaDto>> GetFaturasAsync()
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<FaturaDto>>("api/faturas", _options) 
               ?? Enumerable.Empty<FaturaDto>();
    }

    public async Task<IEnumerable<FaturaDto>> GetFaturasCliente(string id)
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<FaturaDto>>($"api/faturas?nif={id}", _options)
            ?? Enumerable.Empty<FaturaDto>();
    }

    public async Task<FaturaDto?> GetFaturaPorNumeroAsync(string numero)
    {
        try 
        {
            return await _httpClient.GetFromJsonAsync<FaturaDto>($"api/faturas/{numero}", _options);
        }
        catch { return null; }
    }

    public async Task<FaturaDto?> CriarFaturaAsync(FaturaCriacaoDto faturaDto)
    {
        var response = await _httpClient.PostAsJsonAsync("api/faturas", faturaDto, _options);
        if (!response.IsSuccessStatusCode) return null;
        
        return await response.Content.ReadFromJsonAsync<FaturaDto>(_options);
    }

    public async Task<bool> EliminarFaturaAsync(string numero)
    {
        var response = await _httpClient.DeleteAsync($"api/faturas/{numero}");
        return response.IsSuccessStatusCode;
    }
}