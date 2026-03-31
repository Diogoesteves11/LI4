using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobiFix.API.DTOs;
using MobiFix.API.Services.GestaoUtilizadores;

namespace MobiFix.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UtilizadoresController : ControllerBase
{
    private readonly IGestaoUtilizadores _userService;

    public UtilizadoresController(IGestaoUtilizadores userService) => _userService = userService;


    [HttpGet("cliente/{email}")]
    [Authorize(Roles = "Administrador,Operador,Cliente")]
    public async Task<IActionResult> GetCliente(string email)
    {
        var cliente = await _userService.GetCliente(email);
        if (cliente == null) return NotFound();

        return Ok(new
        {
            cliente.Id,
            cliente.Nome,
            cliente.Email,
            cliente.Nif,
            Telefone = cliente.Contacto,
            cliente.Morada,
            Trotinetes = cliente.Trotinetes.Select(t => new
            {
                t.Id,
                t.NumeroSerie,
                t.Marca,
                t.Modelo,
                t.EmServico
            })
        });
    }

    [HttpPatch("cliente/{email}")]
    [Authorize(Roles = "Administrador,Cliente")]
    public async Task<IActionResult> EditarCliente(string email, [FromBody] EditarClienteRequest request)
    {
        var ok = await _userService.EditarDadosCliente(email, request.Telefone, request.Morada);
        return ok ? Ok(new { message = "Dados atualizados." }) : BadRequest();
    }

    // ─── Funcionários ───

    [HttpGet("funcionario/{numero}")]
    [Authorize(Roles = "Administrador,Operador,Mecanico")]
    public async Task<IActionResult> GetFuncionario(string numero)
    {
        var func = await _userService.GetFuncionario(numero);
        if (func == null) return NotFound();

        return Ok(new {func.Id ,func.Numero, func.Nome, func.Email, func.Contacto, func.Ativo });
    }

    [HttpPost("funcionario")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> RegistarFuncionario([FromBody] RegistarFuncionarioRequest request)
    {
        var ok = await _userService.RegistarFuncionario(
            request.NumeroMecanografico, request.Nome, request.Email,
            request.Contacto, request.Cargo, request.Especialidade, request.Password
        );

        if (!ok) return Conflict(new { message = "Funcionário já existe." });
        return Created("", new { message = "Funcionário registado." });
    }

    [HttpPatch("funcionario/{numero}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> EditarFuncionario(string numero, [FromBody] EditarFuncionarioRequest request)
    {
        var ok = await _userService.EditarDadosFuncionario(numero, request.Nome, request.Email, request.Cargo);
        return ok ? Ok(new { message = "Dados atualizados." }) : BadRequest();
    }

    [HttpPatch("funcionario/{numero}/desativar")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> DesativarFuncionario(string numero)
    {
        var ok = await _userService.DesativarFuncionario(numero);
        return ok ? Ok(new { message = "Funcionário desativado." }) : NotFound();
    }

    [HttpPatch("funcionario/{numero}/ativar")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> AtivarFuncionario(string numero)
    {
        var ok = await _userService.AtivarFuncionario(numero);
        return ok ? Ok(new { message = "Funcionário ativado." }) : NotFound();
    }

    // ─── Trotinetes ───

    [HttpPost("trotinete")]
    [Authorize(Roles = "Cliente,Operador")]
    public async Task<IActionResult> RegistarTrotinete([FromBody] RegistarTrotineteRequest request)
    {
        var ok = await _userService.RegistarTrotinete(request.Email, request.Marca, request.Modelo, request.NumeroSerie);
        return ok ? Created("", new { message = "Trotinete registada." }) : BadRequest();
    }
}
