using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public interface IAgendaRepository
{
    Task<AgendaMecanicoDto?> CriarSlotAsync(AgendaMecanicoDto dto);
    Task<List<AgendaMecanicoDto>> ObterPorMecanicoAsync(int mecanicoId);
    Task<List<AgendaMecanicoDto>> ObterPorServicoAsync(int servicoId);
    Task<bool> AtualizarEstadoAsync(int agendaId, string estado);
}
