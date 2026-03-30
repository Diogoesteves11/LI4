using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public interface ICatalogoIntervencoesRepository
{
    Task<List<IntervencaoCatalogoDto>> ObterTodosAsync();
    Task<IntervencaoCatalogoDto?> ObterPorIdAsync(int id);
}
