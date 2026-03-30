using MobiFix.API.Models.GestaoUtilizadores;

namespace MobiFix.API.Repositories;

public interface iClienteRepository
{
    Task<Cliente?> ObterPorEmailAsync(string nif, bool incluirTrotinetes = false);
    Task<bool> RegistarAsync(Cliente cliente);
    public async Task<bool> AtualizarParcialAsync(string email, object dados);
    public async Task<bool> ExisteClienteAsync(string email);
}