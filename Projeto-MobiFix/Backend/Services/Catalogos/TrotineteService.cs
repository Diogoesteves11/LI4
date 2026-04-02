namespace Backend.Services;

using System.Net.Http.Json;
using Backend.Models;

public class TrotineteService : ITrotineteService
{
    private readonly HttpClient _httpClient;

    public TrotineteService(HttpClient httpCliente)
    {
        _httpClient = httpCliente;
    }

    public async Task<IEnumerable<TrotineteDto>>GetTrotinetesClienteAsync(string clienteId)
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<TrotineteDto>>($"clientes/{clienteId}/trotinetes")
                ?? Enumerable.Empty<TrotineteDto>();
    }
}