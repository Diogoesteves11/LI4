using MobiFix.API.DTOs;
using MobiFix.API.Repositories;

namespace MobiFix.API.Services.GestaoAgenda;

public class AgendaService : IGestaoAgenda
{
    private readonly IAgendaRepository _agendaRepo;

    public AgendaService(IAgendaRepository agendaRepo)
    {
        _agendaRepo = agendaRepo;
    }

    public async Task<AgendaMecanicoDto?> AgendarSlot(AgendarSlotRequest request)
    {
        var tiposValidos = new[] { "Diagnostico", "Reparacao" };
        if (!tiposValidos.Contains(request.TipoSlot)) return null;

        var dto = new AgendaMecanicoDto
        {
            MecanicoID = request.MecanicoID,
            ServicoID = request.ServicoID,
            TipoSlot = request.TipoSlot,
            IntervencaoID = request.IntervencaoID,
            DataHoraInicio = request.DataHoraInicio,
            Estado = "Reservado"
        };

        return await _agendaRepo.CriarSlotAsync(dto);
    }

    public async Task<List<AgendaMecanicoDto>> ObterAgendaMecanico(int mecanicoId)
    {
        return await _agendaRepo.ObterPorMecanicoAsync(mecanicoId);
    }

    public async Task<List<AgendaMecanicoDto>> ObterAgendaServico(int servicoId)
    {
        return await _agendaRepo.ObterPorServicoAsync(servicoId);
    }

    public async Task<bool> ConcluirSlot(int agendaId)
    {
        return await _agendaRepo.AtualizarEstadoAsync(agendaId, "Concluido");
    }
}
