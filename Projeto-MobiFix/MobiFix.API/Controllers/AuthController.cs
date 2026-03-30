using Microsoft.AspNetCore.Mvc;
using MobiFix.API.DTOs;
using MobiFix.API.Models.Utilizadores;
using MobiFix.API.Services.GestaoUtilizadores;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MobiFix.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IGestaoUtilizadores _userService;
    private readonly IConfiguration _config;

    public AuthController(IGestaoUtilizadores userService, IConfiguration config)
    {
        _userService = userService;
        _config = config;
    }

    [HttpPost("login/cliente")]
    public async Task<IActionResult> LoginCliente([FromBody] LoginClienteRequest request)
    {
        var cliente = await _userService.LoginCliente(request.Email, request.Password);
        if (cliente == null) return Unauthorized(new { message = "Credenciais inválidas." });

        var token = GerarToken(cliente.Email, "Cliente", cliente.Id.ToString());
        return Ok(new { token, nome = cliente.Nome, email = cliente.Email, clienteId = cliente.Id });
    }

    [HttpPost("login/funcionario")]
    public async Task<IActionResult> LoginFuncionario([FromBody] LoginFuncionarioRequest request)
    {
        var func = await _userService.LoginFuncionario(request.NumeroMecanografico, request.Password);
        if (func == null) return Unauthorized(new { message = "Credenciais inválidas." });

        string cargo = func switch
        {
            Mecanico => "Mecanico",
            Administrador => "Administrador",
            Operador => "Operador",
            _ => "Funcionario"
        };

        var token = GerarToken(func.Numero, cargo, func.Id.ToString());
        return Ok(new { token, nome = func.Nome, numero = func.Numero, cargo });
    }

    [HttpPost("registar/cliente")]
    public async Task<IActionResult> RegistarCliente([FromBody] RegistarClienteRequest request)
    {
        var sucesso = await _userService.RegistarCliente(
            request.Nome, request.NIF, request.Email, request.Telefone, request.Morada, request.Password
        );

        if (!sucesso) return Conflict(new { message = "Email já registado." });

        return Created("", new { message = "Cliente registado com sucesso." });
    }

    private string GerarToken(string identifier, string role, string id)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _config["Jwt:Key"] ?? "MobiFixSecretKey2024MobiFixSecretKey2024"
        ));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, id),
            new Claim(ClaimTypes.Name, identifier),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"] ?? "MobiFix.API",
            audience: _config["Jwt:Audience"] ?? "MobiFix.Frontend",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
