using System.Net.Http.Json;
using MobiFix.API.Models.GestaoUtilizadores;

namespace MobiFix.API.Repositories;

public class ClienteRepository : iClienteRepository
{
    private readonly HttpClient _http;

    public ClienteRepository(HttpClient http) => _http = http;

    public async Task<Cliente?> ObterPorNifAsync(string nif, bool incluirTrotinetes = false)
    {
        // Se quisermos as trotinetes, usamos o $expand do DAB
        string url = $"api/Cliente/nif/{nif}";
        if (incluirTrotinetes) url += "?$expand=trotinetes";

        var response = await _http.GetFromJsonAsync<DabResponse<Cliente>>(url);
        return response?.Value?.FirstOrDefault();
    }

    public async Task<bool> RegistarAsync(Cliente cliente)
    {
        var res = await _http.PostAsJsonAsync("api/Cliente", cliente);
        return res.IsSuccessStatusCode;
    }
}

// Auxiliar para ler o JSON do DAB
public class DabResponse<T> { public List<T> Value { get; set; } = new(); }