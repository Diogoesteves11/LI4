namespace Backend.Controllers;

using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/Encomendas")]
[Authorize]
public class EncomendaStockController : ControllerBase
{
    private readonly IEncomendaStockService _encomendaService;

    public EncomendaStockController(IEncomendaStockService encomendaService)
    {
        _encomendaService = encomendaService;
    }

    [HttpGet("stock")]
    public async Task<IActionResult> Listar()
    {
        var encomendas = await _encomendaService.GetEncomendasAsync();
        return Ok(encomendas);
    }

    [HttpGet("stock/{id}")]
    public async Task<IActionResult> Obter(int id)
    {
        var encomenda = await _encomendaService.GetEncomendaPorIdAsync(id);
        if (encomenda == null) return NotFound(new { mensagem = "Encomenda não encontrada." });
        return Ok(encomenda);
    }

    [HttpPost("stock")]
    public async Task<IActionResult> Criar([FromBody] EncomendaStockCriacaoDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var encomenda = await _encomendaService.CriarEncomendaAsync(dto);
        if (encomenda == null)
            return BadRequest(new { mensagem = "Erro ao criar encomenda de stock." });

        return CreatedAtAction(nameof(Obter), new { id = encomenda.EncomendaID }, encomenda);
    }

    [HttpPut("stock/{id}")]
    public async Task<IActionResult> Atualizar(int id, [FromBody] EncomendaStockAtualizacaoDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var encomenda = await _encomendaService.AtualizarEncomendaAsync(id, dto);
        if (encomenda == null) return NotFound(new { mensagem = "Encomenda não encontrada." });
        return Ok(encomenda);
    }

    [HttpDelete("stock/{id}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var sucesso = await _encomendaService.EliminarEncomendaAsync(id);
        if (!sucesso) return NotFound(new { mensagem = "Encomenda não encontrada." });
        return NoContent();
    }
}
