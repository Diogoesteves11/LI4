using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public interface INotaCreditoRepository
{
    Task<NotaCreditoDto?> CriarAsync(NotaCreditoDto dto);
    Task<NotaCreditoDto?> ObterPorDevolucaoAsync(int devolucaoId);
}
