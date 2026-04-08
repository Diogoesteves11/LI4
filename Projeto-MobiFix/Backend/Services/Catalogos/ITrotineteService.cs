namespace Backend.Services;

using Backend.Models;

public interface ITrotineteService
{
    Task<IEnumerable<TrotineteDto>> GetTrotinetesClienteAsync(string clienteNIF);
    Task<TrotineteDto?> CriarTrotineteAsync(string clienteNIF, TrotinetelCriacaoDto criacaoDto);
    Task<bool> EliminarTrotineteAsync(string clienteNIF, string numeroSerie);
}