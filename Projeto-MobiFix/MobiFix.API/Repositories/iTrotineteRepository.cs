using MobiFix.API.Models.GestaoServicos;

namespace MobiFix.API.Repositories;

public interface iTrotineteRepository
{
    Task<Trotinete?> ObterPorIdAsync(string id);
    Task<IEnumerable<Trotinete>> ObterPorClienteAsync(string clienteNif);
    Task<bool> CriarAsync(Trotinete trotinete);
}