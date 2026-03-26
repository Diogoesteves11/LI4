using MobiFix.API.Models.GestaoUtilizadores;

namespace MobiFix.API.Repositories;

public interface iClienteRepository
{
    Task<Cliente?> ObterPorNifAsync(string nif, bool incluirTrotinetes = false);
    Task<bool> RegistarAsync(Cliente cliente);
}