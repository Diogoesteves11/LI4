using System.Net.Http.Json;
using MobiFix.API.Models.Utilizadores;
using MobiFix.API.DTOs;
using System.Text.Json;

namespace MobiFix.API.Repositories;

public class FuncionarioRepository : IFuncionarioRepository
{
    private readonly HttpClient _http;

    public FuncionarioRepository(HttpClient http) => _http = http;

    public async Task<Funcionario?> GetByNumeroAsync(string numero)
    {
        string url = $"api/Funcionario?$filter=NumeroMecanografico eq '{numero}'";
        var request = new HttpRequestMessage(HttpMethod.Get, url);


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
        var body = new
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
            Especialidade = f is Mecanico m ? m.Especialidade : (string?)null,
            Ativo = f.Ativo
        };

        
        var request = new HttpRequestMessage(HttpMethod.Post, "api/Funcionario");


        var options = new JsonSerializerOptions { PropertyNamingPolicy = null };
        request.Content = JsonContent.Create(body, options: options);

        var res = await _http.SendAsync(request);

        if (!res.IsSuccessStatusCode)
        {
            var erroDab = await res.Content.ReadAsStringAsync();

            throw new Exception($"FALHA NO DAB: Código {res.StatusCode} | Detalhe: {erroDab}");
        }
        return true;
    }

    public async Task<bool> DesativarFuncionarioAsync(string numero) => await MudarStatusAsync(numero, "desativar");
    public async Task<bool> AtivarFuncionarioAsync(string numero) => await MudarStatusAsync(numero, "ativar");

    private async Task<bool> MudarStatusAsync(string numero, bool novoStatus)
    {
        var funcId = await ObterIdPorNumeroAsync(numero);
        if (funcId == null) return false;

        string urlPatch = $"api/Funcionario/FuncionarioID/{funcId}";
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), urlPatch);


        string nomeDaColuna = "Ativo"; 

        string jsonString = $"{{\"{nomeDaColuna}\": {(novoStatus ? "true" : "false")}}}";

        request.Content = new StringContent(jsonString, Encoding.UTF8, "application/json");

        var response = await _http.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var erro = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Erro ao fazer PATCH: {response.StatusCode} - {erro}");
        }

        return response.IsSuccessStatusCode;
    }

    public async Task<bool> ExisteFuncionarioAsync(string numero)
    {
        string url = $"api/Funcionario?$select=FuncionarioID&$filter=NumeroMecanografico eq '{numero}'";
        var request = new HttpRequestMessage(HttpMethod.Get, url);


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

        request.Content = JsonContent.Create(dados);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    private async Task<int?> ObterIdPorNumeroAsync(string numero)
    {
        string url = $"api/Funcionario?$filter=NumeroMecanografico eq '{numero}'&$select=FuncionarioID&$first=1";
        var req = new HttpRequestMessage(HttpMethod.Get, url);

        var res = await _http.SendAsync(req);
        if (!res.IsSuccessStatusCode) return null;

        var envelope = await res.Content.ReadFromJsonAsync<DabResponse<FuncionarioDto>>();
        return envelope?.Value?.FirstOrDefault()?.FuncionarioID;
    }
}
