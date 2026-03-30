using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public interface IFaturaRepository
{
    Task<FaturaDto?> ObterPorIdAsync(int id);
    Task<List<FaturaDto>> ObterPorClienteAsync(int clienteId);
    Task<FaturaDto?> CriarAsync(FaturaDto dto);
    Task<List<FaturaDto>> ObterTodasAsync();
}
