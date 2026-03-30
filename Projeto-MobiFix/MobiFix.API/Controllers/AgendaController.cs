using Microsoft.AspNetCore.Mvc;
using MobiFix.API.DTOs;
using MobiFix.API.Services.GestaoAgenda;

namespace MobiFix.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgendaController : ControllerBase
{
    private readonly IGestaoAgenda _agendaService;

    public AgendaController(IGestaoAgenda agendaService) => _agendaService = agendaService;

    [HttpPost]
    public async Task<IActionResult> AgendarSlot([FromBody] AgendarSlotRequest request)
    {
        var slot = await _agendaService.AgendarSlot(request);
        return slot != null ? Created("", slot) : BadRequest(new { message = "Tipo de slot inválido." });
    }

    [HttpGet("mecanico/{mecanicoId}")]
    public async Task<IActionResult> ObterAgendaMecanico(int mecanicoId)
    {
        return Ok(await _agendaService.ObterAgendaMecanico(mecanicoId));
    }

    [HttpGet("servico/{servicoId}")]
    public async Task<IActionResult> ObterAgendaServico(int servicoId)
    {
        return Ok(await _agendaService.ObterAgendaServico(servicoId));
    }

    [HttpPatch("{agendaId}/concluir")]
    public async Task<IActionResult> ConcluirSlot(int agendaId)
    {
        var ok = await _agendaService.ConcluirSlot(agendaId);
        return ok ? Ok(new { message = "Slot concluído." }) : BadRequest();
    }
}
