namespace Backend.Services;

using Backend.Models;

public interface ITrotineteService
{
    Task<IEnumerable<TrotineteDto>>GetTrotinetesClienteAsync(string clienteId);
}