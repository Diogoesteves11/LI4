namespace Backend.Controllers;

using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IntervencoesCatalogoController : ControllerBase
{
    private readonly IIntervencaoCatalogoService _catalogoService;

    public IntervencoesCatalogoController(IIntervencaoCatalogoService catalogoService)
    {
        _catalogoService = catalogoService;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var lista = await _catalogoService.ListarTodasAsync();
        return Ok(lista);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Obter(int id)
    {
        var item = await _catalogoService.ObterPorIdAsync(id);
        if (item == null) return NotFound(new { mensagem = "Intervenção não encontrada no catálogo." });
        return Ok(item);
    }
}