namespace Backend.Services;

using Backend.Models;

public interface IAgendaService
{
    Task<IEnumerable<AgendaDto>> ListarAgendaAsync();
    Task<AgendaDto?> ObterSlotPorIdAsync(string id);
    Task<AgendaDto?> CriarSlotAsync(AgendaCriacaoDto dto);
    Task<bool> EliminarSlotAsync(string id);
}