namespace Backend.Services;

using System.Net.Http.Json;
using System.Text.Json;
using Backend.Models;

public class ServicoService : IServicoService
{
    private readonly HttpClient _httpClient;
    private static readonly JsonSerializerOptions _options = new() { PropertyNamingPolicy = null };

    public ServicoService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<ServicoDto>> ListarTodosAsync()
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<ServicoDto>>("api/servicos", _options) 
               ?? Enumerable.Empty<ServicoDto>();
    }

    public async Task<ServicoDto?> ObterPorIdAsync(int id)
    {
        try {
            return await _httpClient.GetFromJsonAsync<ServicoDto>($"api/servicos/{id}", _options);
        } catch { return null; }
    }

    public async Task<ServicoDto?> CriarServicoDiagnosticoAsync(ServicoCriacaoDto dto)
    {
        // Mapeamento para o que o Node.js espera no req.body
        var payload = new {
            ServicoID = dto.ServicoID,
            TrotineteNumSerie = dto.TrotineteNumSerie,
            Estado = dto.Estado,
            DescricaoDiagnostico = dto.DescricaoDiagnostico,
            Preco = dto.Preco
        };

        var response = await _httpClient.PostAsJsonAsync("api/servicos", payload, _options);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<ServicoDto>(_options);
    }

    public async Task<bool> AtualizarEstadoAsync(int id, string novoEstado)
    {
        var payload = new { Estado = novoEstado };
        var response = await _httpClient.PutAsJsonAsync($"api/servicos/{id}", payload, _options);
        return response.IsSuccessStatusCode;
    }
}