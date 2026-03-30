using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobiFix.API.DTOs;
using MobiFix.API.Services.GestaoStocks;

namespace MobiFix.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PecasController : ControllerBase
{
    private readonly IGestaoStocks _stockService;

    public PecasController(IGestaoStocks stockService) => _stockService = stockService;

    [HttpGet]
    public async Task<IActionResult> ObterTodas()
    {
        return Ok(await _stockService.ObterTodasPecas());
    }

    [HttpGet("{ean}")]
    public async Task<IActionResult> ObterPorEAN(string ean)
    {
        var peca = await _stockService.ObterPeca(ean);
        return peca != null ? Ok(peca) : NotFound();
    }

    [HttpPatch("{ean}/stock")]
    [Authorize(Roles = "Administrador,Operador")]
    public async Task<IActionResult> AtualizarStock(string ean, [FromBody] int novoStock)
    {
        var ok = await _stockService.AtualizarStockPeca(ean, novoStock);
        return ok ? Ok(new { message = "Stock atualizado." }) : BadRequest();
    }

    [HttpPatch("{ean}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> EditarPeca(string ean, [FromBody] EditarPecaRequest request)
    {
        var campos = new Dictionary<string, object>();
        if (request.Nome != null) campos.Add("Nome", request.Nome);
        if (request.Descricao != null) campos.Add("Descricao", request.Descricao);
        if (request.PVP.HasValue) campos.Add("PVP", request.PVP.Value);
        if (request.CustoAquisicao.HasValue) campos.Add("CustoAquisicao", request.CustoAquisicao.Value);
        if (request.StockMinimo.HasValue) campos.Add("StockMinimo", request.StockMinimo.Value);
        if (request.PadraoReposicao.HasValue) campos.Add("PadraoReposicao", request.PadraoReposicao.Value);

        if (campos.Count == 0) return BadRequest(new { message = "Nenhum campo para atualizar." });

        var ok = await _stockService.EditarPeca(ean, campos);
        return ok ? Ok(new { message = "Peça atualizada." }) : BadRequest();
    }

    [HttpPatch("{ean}/desativar")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> DesativarPeca(string ean)
    {
        var ok = await _stockService.DesativarPeca(ean);
        return ok ? Ok(new { message = "Peça desativada." }) : NotFound();
    }
}
