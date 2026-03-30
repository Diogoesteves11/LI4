using Microsoft.AspNetCore.Mvc;
using MobiFix.API.DTOs;
using MobiFix.API.Services.GestaoServicos;

namespace MobiFix.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicosController : ControllerBase
{
    private readonly IGestaoServicos _servicoService;

    public ServicosController(IGestaoServicos servicoService) => _servicoService = servicoService;

    [HttpPost]
    public async Task<IActionResult> CriarServico([FromBody] CriarServicoRequest request)
    {
        var servico = await _servicoService.CriarServico(request.TrotineteID, request.DataAgendamento, request.FeedbackCliente);
        if (servico == null) return BadRequest();

        return Created($"api/servicos/{servico.ServicoID}", servico);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> ObterServico(int id)
    {
        var servico = await _servicoService.ObterServico(id);
        return servico != null ? Ok(servico) : NotFound();
    }

    [HttpGet]
    public async Task<IActionResult> ObterTodos()
    {
        return Ok(await _servicoService.ObterTodosServicos());
    }

    [HttpGet("trotinete/{trotineteId}")]
    public async Task<IActionResult> ObterPorTrotinete(int trotineteId)
    {
        return Ok(await _servicoService.ObterServicosPorTrotinete(trotineteId));
    }

    [HttpPatch("{id}/iniciar")]
    public async Task<IActionResult> IniciarExecucao(int id)
    {
        var ok = await _servicoService.IniciarExecucao(id);
        return ok ? Ok(new { message = "Serviço em execução." }) : BadRequest(new { message = "Transição de estado inválida." });
    }

    [HttpPatch("{id}/diagnostico")]
    public async Task<IActionResult> RegistarDiagnostico(int id, [FromBody] DiagnosticoRequest request)
    {
        var ok = await _servicoService.RegistarDiagnostico(id, request.DescricaoDiagnostico);
        return ok ? Ok(new { message = "Diagnóstico registado." }) : BadRequest();
    }

    [HttpPatch("{id}/concluir")]
    public async Task<IActionResult> ConcluirServico(int id)
    {
        var ok = await _servicoService.ConcluirServico(id);
        return ok ? Ok(new { message = "Serviço concluído." }) : BadRequest(new { message = "Transição de estado inválida." });
    }

    [HttpPatch("{id}/fechar")]
    public async Task<IActionResult> FecharServico(int id)
    {
        var ok = await _servicoService.FecharServico(id);
        return ok ? Ok(new { message = "Serviço fechado." }) : BadRequest(new { message = "Transição de estado inválida." });
    }

    // ─── Intervenções ───

    [HttpPost("intervencao")]
    public async Task<IActionResult> AtribuirIntervencao([FromBody] AtribuirIntervencaoRequest request)
    {
        var ok = await _servicoService.AtribuirIntervencao(request.ServicoID, request.IntervencaoID, request.MecanicoID);
        return ok ? Created("", new { message = "Intervenção atribuída." }) : BadRequest();
    }

    [HttpPatch("intervencao/{servicoId}/{intervencaoId}/concluir")]
    public async Task<IActionResult> ConcluirIntervencao(int servicoId, int intervencaoId)
    {
        var ok = await _servicoService.ConcluirIntervencao(servicoId, intervencaoId);
        return ok ? Ok(new { message = "Intervenção concluída." }) : BadRequest();
    }

    [HttpPost("intervencao/peca")]
    public async Task<IActionResult> RegistarPeca([FromBody] RegistarPecaIntervencaoRequest request)
    {
        var ok = await _servicoService.RegistarPecaIntervencao(request.ServicoID, request.IntervencaoID, request.PecaID, request.Quantidade);
        return ok ? Created("", new { message = "Peça registada." }) : BadRequest();
    }

    [HttpGet("{servicoId}/intervencoes")]
    public async Task<IActionResult> ObterIntervencoes(int servicoId)
    {
        return Ok(await _servicoService.ObterIntervencoesPorServico(servicoId));
    }

    [HttpGet("catalogo")]
    public async Task<IActionResult> ObterCatalogo()
    {
        return Ok(await _servicoService.ObterCatalogoIntervencoes());
    }
}
