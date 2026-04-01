namespace Backend.Controllers;

using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PecasController : ControllerBase
{
    private readonly IPecaService _pecaService;
    public PecasController(IPecaService pecaService)
    {
        _pecaService = pecaService;
    }

    [HttpGet]
    public async Task<IActionResult>Get()
    {
        var pecas = await _pecaService.GetTodasPecasAsync();
        return Ok(pecas);
    }
}