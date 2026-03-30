using System.Net.Http.Json;
using MobiFix.API.Models.Utilizadores;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class FuncionarioRepository : IFuncionarioRepository
{
    private readonly HttpClient _http;

    public FuncionarioRepository(HttpClient http) => _http = http;

    public async Task<Funcionario?> GetByNumeroAsync(string numero)
    {
        string url = $"api/Funcionario?$filter=NumeroMecanografico eq '{numero}'";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        var resultado = await response.Content.ReadFromJsonAsync<DabResponse<FuncionarioDto>>();
        var dados = resultado?.Value?.FirstOrDefault();
        if (dados == null) return null;

        return dados.Cargo switch
        {
            "Mecanico" => new Mecanico(
                dados.NumeroMecanografico, dados.Nome, dados.Email, dados.Contacto,
                dados.PasswordHash, dados.Ativo, dados.Especialidade, dados.FuncionarioID
            ),
            "Administrador" => new Administrador(
                dados.NumeroMecanografico, dados.Nome, dados.Email, dados.Contacto,
                dados.PasswordHash, dados.Ativo, dados.FuncionarioID
            ),
            "Operador" => new Operador(
                dados.NumeroMecanografico, dados.Nome, dados.Email, dados.Contacto,
                dados.PasswordHash, dados.Ativo, dados.FuncionarioID
            ),
            _ => null
        };
    }

    public async Task<bool> RegistarFuncionarioAsync(Funcionario f)
    {
        var dto = new FuncionarioDto
        {
            NumeroMecanografico = f.Numero,
            Nome = f.Nome,
            Email = f.Email,
            Contacto = f.Contacto,
            PasswordHash = f.PasswordHash,
            Cargo = f switch
            {
                Mecanico => "Mecanico",
                Administrador => "Administrador",
                Operador => "Operador",
                _ => throw new ArgumentException("Tipo de funcionário desconhecido")
            },
            Especialidade = f is Mecanico m ? m.Especialidade : null
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "api/Funcionario");
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dto);

        var res = await _http.SendAsync(request);
        return res.IsSuccessStatusCode;
    }

    public async Task<bool> DesativarFuncionarioAsync(string numero) => await MudarStatusAsync(numero, false);
    public async Task<bool> AtivarFuncionarioAsync(string numero) => await MudarStatusAsync(numero, true);

    private async Task<bool> MudarStatusAsync(string numero, bool novoStatus)
    {
        var funcId = await ObterIdPorNumeroAsync(numero);
        if (funcId == null) return false;

        string urlPatch = $"api/Funcionario/FuncionarioID/{funcId}";
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), urlPatch);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(new { Ativo = novoStatus });

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> ExisteFuncionarioAsync(string numero)
    {
        string url = $"api/Funcionario?$filter=NumeroMecanografico eq '{numero}'&$select=FuncionarioID&$first=1";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return false;

        var result = await response.Content.ReadFromJsonAsync<DabResponse<FuncionarioDto>>();
        return result?.Value?.Any() ?? false;
    }

    public async Task<bool> AtualizarParcialAsync(string numero, object dados)
    {
        var funcId = await ObterIdPorNumeroAsync(numero);
        if (funcId == null) return false;

        string urlPatch = $"api/Funcionario/FuncionarioID/{funcId}";
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), urlPatch);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dados);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    private async Task<int?> ObterIdPorNumeroAsync(string numero)
    {
        string url = $"api/Funcionario?$filter=NumeroMecanografico eq '{numero}'&$select=FuncionarioID&$first=1";
        var req = new HttpRequestMessage(HttpMethod.Get, url);
        req.Headers.Add("X-MS-API-ROLE", "Administrador");

        var res = await _http.SendAsync(req);
        if (!res.IsSuccessStatusCode) return null;

        var envelope = await res.Content.ReadFromJsonAsync<DabResponse<FuncionarioDto>>();
        return envelope?.Value?.FirstOrDefault()?.FuncionarioID;
    }
}
