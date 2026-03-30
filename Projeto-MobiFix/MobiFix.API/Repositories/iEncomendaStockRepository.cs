using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public interface IEncomendaStockRepository
{
    Task<EncomendaStockDto?> CriarAsync(EncomendaStockDto dto);
    Task<List<EncomendaStockDto>> ObterTodasAsync();
    Task<EncomendaStockDto?> ObterPorIdAsync(int id);
    Task<bool> AtualizarEstadoAsync(int id, string estado, int? operadorRececaoId);
}
