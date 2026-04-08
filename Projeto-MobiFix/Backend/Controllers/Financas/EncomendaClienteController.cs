namespace Backend.Controllers;

using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EncomendaClienteController : ControllerBase
{
    private readonly IEncomendaClienteService _encomendaService;

    public EncomendaClienteController(IEncomendaClienteService encomendaService)
    {
        _encomendaService = encomendaService;
    }

    // GET api/EncomendaCliente  — lista só as encomendas do cliente autenticado
    [HttpGet]
    public async Task<IActionResult> ListarMinhasEncomendas()
    {
        var clienteNIF = User.FindFirst("id")?.Value;
        if (clienteNIF is null) return Unauthorized(new { mensagem = "Token inválido." });

        var encomendas = await _encomendaService.ListarEncomendasClienteAsync(clienteNIF);
        return Ok(encomendas);
    }

    // POST api/EncomendaCliente  — cria uma reserva para o cliente autenticado
    [HttpPost]
    public async Task<IActionResult> CriarEncomenda([FromBody] EncomendaClienteCriacaoDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var clienteNIF = User.FindFirst("id")?.Value;
        if (clienteNIF is null) return Unauthorized(new { mensagem = "Token inválido." });

        var encomenda = await _encomendaService.CriarEncomendaAsync(clienteNIF, dto);

        if (encomenda is null)
            return BadRequest(new { mensagem = "Não foi possível criar a reserva." });

        return Created(string.Empty, encomenda);
    }
}