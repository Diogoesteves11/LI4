using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobiFix.API.DTOs;
using MobiFix.API.Services.GestaoFinanceira;

namespace MobiFix.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FaturasController : ControllerBase
{
    private readonly IGestaoFinancas _financasService;

    public FaturasController(IGestaoFinancas financasService) => _financasService = financasService;

    [HttpPost]
    [Authorize(Roles = "Operador,Administrador")]
    public async Task<IActionResult> EmitirFatura([FromBody] CriarFaturaRequest request)
    {
        var fatura = await _financasService.EmitirFatura(request);
        return fatura != null ? Created("", fatura) : BadRequest(new { message = "Dados inválidos." });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> ObterFatura(int id)
    {
        var fatura = await _financasService.ObterFatura(id);
        return fatura != null ? Ok(fatura) : NotFound();
    }

    [HttpGet("cliente/{clienteId}")]
    [Authorize(Roles = "Cliente,Administrador,Operador")]
    public async Task<IActionResult> ObterFaturasCliente(int clienteId)
    {
        return Ok(await _financasService.ObterFaturasCliente(clienteId));
    }

    [HttpPost("devolucao")]
    [Authorize(Roles = "Operador,Administrador")]
    public async Task<IActionResult> RegistarDevolucao([FromBody] CriarDevolucaoRequest request)
    {
        var dev = await _financasService.RegistarDevolucao(request.FaturaID, request.Motivo);
        return dev != null ? Created("", dev) : BadRequest();
    }

    [HttpGet("relatorio")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> GerarRelatorio([FromQuery] DateTime inicio, [FromQuery] DateTime fim)
    {
        var relatorio = await _financasService.GerarRelatorio(inicio, fim);
        return Ok(relatorio);
    }

    [HttpGet("inventario")]
    [Authorize(Roles = "Administrador,Operador")]
    public async Task<IActionResult> ObterInventario()
    {
        return Ok(await _financasService.ObterInventario());
    }
}
