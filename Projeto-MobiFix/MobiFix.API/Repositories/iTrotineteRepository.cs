using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public interface ITrotineteRepository
{
    Task<TrotineteDto?> ObterPorSerieAsync(string numSerie);
    Task<bool> CriarComEmailAsync(TrotineteDto dto, string email);
    Task<bool> AtualizarPorSerieAsync(string numSerie, object dados);
    Task<bool> AlterarEstadoTrotinete(string numSerie, bool estado);
}
