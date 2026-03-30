using MobiFix.API.Models.Utilizadores;

namespace MobiFix.API.Repositories;

public interface IClienteRepository
{
    Task<Cliente?> ObterPorEmailAsync(string email, bool incluirTrotinetes = false);
    Task<bool> RegistarAsync(Cliente cliente);
    Task<bool> AtualizarParcialPorEmailAsync(string email, object dados);
    Task<bool> ExisteClientePorEmailAsync(string email);
    Task<int?> ObterIdPorEmailAsync(string email);
}
