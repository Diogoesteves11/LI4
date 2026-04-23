namespace Backend.Controllers;

using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;

[ApiController]
[Route("api/[controller]")]
public class PecasController : ControllerBase
{
    private readonly IPecaService _pecaService;
    
    public PecasController(IPecaService pecaService)
    {
        _pecaService = pecaService;
    }

    // GET: api/pecas
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try 
        {
            var pecas = await _pecaService.GetTodasPecasAsync();
            return Ok(pecas);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // GET: api/pecas/{ean}
    [HttpGet("{ean}")]
    public async Task<IActionResult> ObterPorEan(string ean)
    {
        try
        {
            var peca = await _pecaService.GetPecaPorEanAsync(ean);
            
            if (peca == null) 
            {
                return NotFound(new { mensagem = "Peça não encontrada." });
            }
            
            return Ok(peca);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // POST: api/pecas
    [HttpPost]
    [Authorize(Policy = "ApenasAdmin")]
    // CORREÇÃO AQUI: Mudou de Peca para PecaDto
    public async Task<IActionResult> CriarPeca([FromBody] PecaDto novaPeca) 
    {
        try
        {
            var pecaCriada = await _pecaService.CriarPecaAsync(novaPeca);
            
            if (pecaCriada == null) return BadRequest(new { error = "Não foi possível criar a peça na Data API." });

            return CreatedAtAction(nameof(ObterPorEan), new { ean = pecaCriada.CodigoEAN }, pecaCriada);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // PUT: api/pecas/{ean}
    [HttpPut("{ean}")]
    [Authorize(Policy = "ApenasAdmin")]
    // CORREÇÃO AQUI: Mudou de Peca para PecaDto
    public async Task<IActionResult> AtualizarPeca(string ean, [FromBody] PecaDto pecaAtualizada)
    {
        try
        {
            var peca = await _pecaService.AtualizarPecaAsync(ean, pecaAtualizada);
            
            if (peca == null) 
            {
                return NotFound(new { mensagem = "Peça não encontrada ou erro na atualização." });
            }
            
            return Ok(peca);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // PATCH: api/pecas/{ean}/estado
    [HttpPatch("{ean}/estado")]
    [Authorize(Policy = "ApenasAdmin")]
    public async Task<IActionResult> AlterarEstado(string ean, [FromBody] EstadoPecaDto estadoDto)
    {
        try
        {
            var peca = await _pecaService.AlterarEstadoPecaAsync(ean, estadoDto.Ativo);
            
            if (peca == null) 
            {
                return NotFound(new { mensagem = "Peça não encontrada ou erro ao alterar estado." });
            }
            
            return Ok(peca);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // DELETE: api/pecas/{ean}
    [HttpDelete("{ean}")]
    [Authorize(Policy = "ApenasAdmin")]
    public async Task<IActionResult> EliminarPeca(string ean)
    {
        try
        {
            var sucesso = await _pecaService.EliminarPecaAsync(ean);
            
            if (!sucesso) 
            {
                return NotFound(new { mensagem = "Peça não encontrada." });
            }
            
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}