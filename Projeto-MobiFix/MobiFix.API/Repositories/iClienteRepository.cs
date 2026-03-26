using MobiFix.API.Models.GestaoUtilizadores;

namespace MobiFix.API.Repositories;

public interface iClienteRepository
{
    Task<Cliente?> ObterPorNifAsync(string nif, bool incluirTrotinetes = false);
    Task<bool> RegistarAsync(Cliente cliente);
    public async Task<bool> AtualizarParcialAsync(string nif, object dados);
    public async Task<bool> ExisteClienteAsync(string nif);
}