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

    [HttpPost("/login/funcionario")]
    public async Task<IActionResult> LoginFuncionario([FromBody] FuncionarioLoginDto loginDto)
    {
        var token = await _authService.LoginFuncionarioAsync(loginDto);

        if (token is null)  return Unauthorized(new { mensagem = "Número mecanográfico ou password incorretos." });

        return Ok(new {token});
    }

    [HttpPost("/register/cliente")]
    public async Task<IActionResult> Registar([FromBody] ClienteRegistoDto registoDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
 
        var sucesso = await _authService.RegistarClienteAsync(registoDto);
 
        if (!sucesso)
            return Conflict(new { mensagem = "Não foi possível criar a conta. O email ou NIF já podem estar registados." });
 
        return Created(string.Empty, new { mensagem = "Conta criada com sucesso." });
    }
 
    [HttpPost("/login/cliente")]
    public async Task<IActionResult> Login([FromBody] ClienteLoginDto loginDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
 
        if (string.IsNullOrWhiteSpace(loginDto.NIF))
            return BadRequest(new { mensagem = "É necessário fornecer o NIF." });
 
        var token = await _authService.LoginClienteAsync(loginDto);
 
        if (token is null)
            return Unauthorized(new { mensagem = "Credenciais inválidas." });
 
        return Ok(new { token });
    }
}