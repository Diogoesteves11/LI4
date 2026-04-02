namespace Backend.Controllers;

using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TrotinetesController : ControllerBase
{
    private readonly ITrotineteService _trotineteService;

    public TrotinetesController(ITrotineteService trotineteService)
    {
        _trotineteService = trotineteService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMinhasTrotinetes()
    {
        var clienteIdClaim = User.FindFirst("id")?.Value;

        if(clienteIdClaim is null)
        {
            return Unauthorized(new { mensagem = "Token inválido." });
        }

        var trotinetes = await _trotineteService.GetTrotinetesClienteAsync(clienteIdClaim);
        return Ok(trotinetes);
    }
}