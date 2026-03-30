using System.Net.Http.Json;
using MobiFix.API.Models.Utilizadores;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class FuncionarioRepository : iFuncionarioRepository {
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
                dados.PasswordHash, dados.Ativo, dados.Especialidade 
            ),
            "Administrador" => new Administrador(
                dados.NumeroMecanografico, dados.Nome, dados.Email, dados.Contacto, 
                dados.PasswordHash, dados.Ativo
            ),
            "Operador" => new Operador(
                dados.NumeroMecanografico, dados.Nome, dados.Email, dados.Contacto, 
                dados.PasswordHash, dados.Ativo
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

        var res = await _http.PostAsJsonAsync("api/Funcionario", dto);
        return res.IsSuccessStatusCode;
    }

    public async Task<bool> DesativarFuncionarioAsync(string numero) => await MudarStatusAsync(numero, false);

    public async Task<bool> AtivarFuncionarioAsync(string numero) => await MudarStatusAsync(numero, true);

    private async Task<bool> MudarStatusAsync(string numero, bool novoStatus)
    {
        string urlBusca = $"api/Funcionario?$filter=NumeroMecanografico eq '{numero}'&$select=FuncionarioID";

        var reqBusca = new HttpRequestMessage(HttpMethod.Get, urlBusca);
        reqBusca.Headers.Add("X-MS-API-ROLE", "Administrador");

        var resBusca = await _http.SendAsync(reqBusca);
        var envelope = await resBusca.Content.ReadFromJsonAsync<DabResponse<FuncionarioDto>>();
        var idTecnico = envelope?.Value?.FirstOrDefault()?.FuncionarioID;

        if (idTecnico == null) return false;

        string urlPatch = $"api/Funcionario/FuncionarioID/{idTecnico}";

        var dadosParaMudar = new { Ativo = novoStatus };
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), urlPatch);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dadosParaMudar);

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
        string urlBusca = $"api/Cliente?$filter=Email eq '{email}'&$select=ClienteID";
        var resBusca = await _http.GetFromJsonAsync<DabResponse<ClienteDto>>(urlBusca);
        var funcionarioId = resBusca?.Value?.FirstOrDefault()?.FuncionarioID;

        if (funcionarioId == null) return false;

        string urlPatch = $"api/Funcionario/FuncionarioID/{funcionarioId}";

        var request = new HttpRequestMessage(new HttpMethod("PATCH"), urlPatch);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dados);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }
}