using System.Net.Http.Json;
using MobiFix.API.Models.GestaoServicos;

namespace MobiFix.API.Repositories;

public class TrotineteRepository : iTrotineteRepository
{
    private readonly HttpClient _http;

    public TrotineteRepository(HttpClient http) => _http = http;

    public async Task<Trotinete?> ObterPorIdAsync(string id)
    {
        var response = await _http.GetFromJsonAsync<DabResponse<Trotinete>>($"api/Trotinete/Id/{id}");
        return response?.Value?.FirstOrDefault();
    }

    public async Task<IEnumerable<Trotinete>> ObterPorClienteAsync(string clienteNif)
    {
        // O DAB usa filtros estilo OData: ?$filter=ClienteId eq '123'
        var response = await _http.GetFromJsonAsync<DabResponse<Trotinete>>($"api/Trotinete?$filter=nifCliente eq '{clienteNif}'");
        return response?.Value ?? Enumerable.Empty<Trotinete>();
    }

    public async Task<bool> CriarAsync(Trotinete trotinete)
    {
        var res = await _http.PostAsJsonAsync("api/Trotinete", trotinete);
        return res.IsSuccessStatusCode;
    }
}