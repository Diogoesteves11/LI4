using System.Net.Http.Json;
using MobiFix.API.Models.Utilizadores;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class ClienteRepository : IClienteRepository
{
    private readonly HttpClient _http;

    public ClienteRepository(HttpClient http) => _http = http;

    public async Task<Cliente?> ObterPorEmailAsync(string email, bool incluirTrotinetes = false)
    {
        string url = $"api/Cliente?$filter=Email eq '{email}'";
        if (incluirTrotinetes) url += "&$expand=trotinetes";

        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        var result = await response.Content.ReadFromJsonAsync<DabResponse<ClienteDto>>();
        var dto = result?.Value?.FirstOrDefault();
        if (dto == null) return null;

        return new Cliente(dto.NIF, dto.Nome, dto.Email, dto.Telefone, dto.PasswordHash)
        {
            Id = dto.ClienteID,
            Morada = dto.Morada
        };
    }

    public async Task<bool> RegistarAsync(Cliente cliente)
    {
        var body = new
        {
            Nome = cliente.Nome,
            NIF = cliente.Nif,
            Email = cliente.Email,
            Telefone = cliente.Contacto,
            Morada = cliente.Morada,
            PasswordHash = cliente.PasswordHash
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "api/Cliente");
        request.Content = JsonContent.Create(body);

        var res = await _http.SendAsync(request);
        return res.IsSuccessStatusCode;
    }

    public async Task<bool> AtualizarParcialPorEmailAsync(string email, object dados)
    {
        var clienteId = await ObterIdPorEmailAsync(email);
        if (clienteId == null) return false;

        string urlPatch = $"api/Cliente/ClienteID/{clienteId}";
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), urlPatch);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dados);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> ExisteClientePorEmailAsync(string email)
    {
        string url = $"api/Cliente?$filter=Email eq '{email}'&$select=ClienteID&$first=1";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return false;

        var result = await response.Content.ReadFromJsonAsync<DabResponse<ClienteDto>>();
        return result?.Value?.Any() ?? false;
    }

    public async Task<int?> ObterIdPorEmailAsync(string email)
    {
        string url = $"api/Cliente?$filter=Email eq '{email}'&$select=ClienteID&$first=1";
        var req = new HttpRequestMessage(HttpMethod.Get, url);
        req.Headers.Add("X-MS-API-ROLE", "Administrador");

        var res = await _http.SendAsync(req);
        if (!res.IsSuccessStatusCode) return null;

        var envelope = await res.Content.ReadFromJsonAsync<DabResponse<ClienteDto>>();
        return envelope?.Value?.FirstOrDefault()?.ClienteID;
    }
}
