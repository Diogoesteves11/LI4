using MobiFix.API.DTOs;

namespace MobiFix.API.Services.GestaoAgenda;

public interface IGestaoAgenda
{
    Task<AgendaMecanicoDto?> AgendarSlot(AgendarSlotRequest request);
    Task<List<AgendaMecanicoDto>> ObterAgendaMecanico(int mecanicoId);
    Task<List<AgendaMecanicoDto>> ObterAgendaServico(int servicoId);
    Task<bool> ConcluirSlot(int agendaId);
}
