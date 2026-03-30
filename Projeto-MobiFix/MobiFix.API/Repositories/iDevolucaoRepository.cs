using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public interface IDevolucaoRepository
{
    Task<DevolucaoDto?> CriarAsync(DevolucaoDto dto);
    Task<DevolucaoDto?> ObterPorIdAsync(int id);
}
