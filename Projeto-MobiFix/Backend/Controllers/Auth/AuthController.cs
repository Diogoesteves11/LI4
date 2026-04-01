namespace Backend.Controllers;

using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] FuncionarioLoginDto loginDto)
    {
        var token = await _authService.LoginAsync(loginDto);

        if (token is null)  return Unauthorized(new { mensagem = "Número mecanográfico ou password incorretos." });

        return Ok(new {token});
    }
}