namespace Backend.Controllers;

using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ServicosController : ControllerBase
{
    private readonly IServicoService _servicoService;

    public ServicosController(IServicoService servicoService)
    {
        _servicoService = servicoService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTodos()
    {
        var servicos = await _servicoService.ListarTodosAsync();
        return Ok(servicos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPorId(int id)
    {
        var servico = await _servicoService.ObterPorIdAsync(id);
        if (servico == null) return NotFound();
        return Ok(servico);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] ServicoCriacaoDto dto)
    {
        var novoServico = await _servicoService.CriarServicoDiagnosticoAsync(dto);
        if (novoServico == null) return BadRequest(new { mensagem = "Erro ao criar serviço." });
        
        return CreatedAtAction(nameof(GetPorId), new { id = novoServico.ServicoID }, novoServico);
    }
}