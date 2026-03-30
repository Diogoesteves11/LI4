using Microsoft.AspNetCore.Mvc;
using MobiFix.API.DTOs;
using MobiFix.API.Services.GestaoStocks;

namespace MobiFix.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EncomendasController : ControllerBase
{
    private readonly IGestaoStocks _stockService;

    public EncomendasController(IGestaoStocks stockService) => _stockService = stockService;

    // ─── Encomendas Stock (Reposição) ───

    [HttpPost("stock")]
    public async Task<IActionResult> CriarEncomendaStock([FromBody] EncomendaStockDto request)
    {
        var enc = await _stockService.CriarEncomendaStock(request.PecaID, request.Quantidade, request.AdminValidadorID ?? 0);
        return enc != null ? Created("", enc) : BadRequest();
    }

    [HttpGet("stock")]
    public async Task<IActionResult> ObterEncomendasStock()
    {
        return Ok(await _stockService.ObterEncomendasStock());
    }

    [HttpPatch("stock/{id}/rececionar")]
    public async Task<IActionResult> RececionarEncomenda(int id, [FromBody] int operadorId)
    {
        var ok = await _stockService.RececionarEncomendaStock(id, operadorId);
        return ok ? Ok(new { message = "Encomenda rececionada." }) : BadRequest();
    }

    // ─── Encomendas Cliente (Click & Collect) ───

    [HttpPost("cliente")]
    public async Task<IActionResult> CriarEncomendaCliente([FromBody] CriarEncomendaClienteRequest request)
    {
        var enc = await _stockService.CriarEncomendaCliente(request);
        return enc != null ? Created("", enc) : BadRequest(new { message = "Stock insuficiente ou dados inválidos." });
    }

    [HttpGet("cliente/{clienteId}")]
    public async Task<IActionResult> ObterEncomendasCliente(int clienteId)
    {
        return Ok(await _stockService.ObterEncomendasCliente(clienteId));
    }

    [HttpPatch("cliente/{id}/levantar")]
    public async Task<IActionResult> LevantarEncomenda(int id)
    {
        var ok = await _stockService.LevantarEncomendaCliente(id);
        return ok ? Ok(new { message = "Encomenda levantada." }) : BadRequest();
    }
}
