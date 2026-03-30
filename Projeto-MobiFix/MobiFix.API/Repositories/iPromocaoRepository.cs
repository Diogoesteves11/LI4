using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public interface IPromocaoRepository
{
    Task<PromocaoDto?> CriarAsync(PromocaoDto dto);
    Task<bool> AdicionarPecaPromocaoAsync(PromocaoPecaDto dto);
    Task<List<PromocaoDto>> ObterTodasAsync();
    Task<PromocaoDto?> ObterPorIdAsync(int id);
    Task<bool> EliminarAsync(int id);
}
