namespace Backend.Controllers;

using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize] 
public class FaturasController : ControllerBase
{
    private readonly IFaturaService _faturaService;

    public FaturasController(IFaturaService faturaService)
    {
        _faturaService = faturaService;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var faturas = await _faturaService.GetFaturasAsync();
        return Ok(faturas);
    }

    [HttpGet("{numero}")]
    public async Task<IActionResult> Obter(string numero)
    {
        var fatura = await _faturaService.GetFaturaPorNumeroAsync(numero);
        if (fatura == null) return NotFound(new { mensagem = "Fatura não encontrada." });
        return Ok(fatura);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] FaturaCriacaoDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var novaFatura = await _faturaService.CriarFaturaAsync(dto);
        if (novaFatura == null) 
            return BadRequest(new { mensagem = "Erro ao criar fatura. Verifique se o número já existe." });

        return CreatedAtAction(nameof(Obter), new { numero = novaFatura.NumeroFatura }, novaFatura);
    }

    [HttpDelete("{numero}")]
    public async Task<IActionResult> Eliminar(string numero)
    {
        var sucesso = await _faturaService.EliminarFaturaAsync(numero);
        if (!sucesso) return NotFound(new { mensagem = "Fatura não encontrada." });
        
        return NoContent();
    }
}