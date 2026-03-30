using Microsoft.AspNetCore.Mvc;
using MobiFix.API.DTOs;
using MobiFix.API.Services.GestaoStocks;

namespace MobiFix.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PromocoesController : ControllerBase
{
    private readonly IGestaoStocks _stockService;

    public PromocoesController(IGestaoStocks stockService) => _stockService = stockService;

    [HttpPost]
    public async Task<IActionResult> CriarPromocao([FromBody] CriarPromocaoRequest request)
    {
        var promo = await _stockService.CriarPromocao(request);
        return promo != null ? Created("", promo) : BadRequest(new { message = "Dados inválidos." });
    }

    [HttpGet]
    public async Task<IActionResult> ObterTodas()
    {
        return Ok(await _stockService.ObterPromocoes());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> EliminarPromocao(int id)
    {
        var ok = await _stockService.EliminarPromocao(id);
        return ok ? Ok(new { message = "Promoção eliminada." }) : NotFound();
    }
}
