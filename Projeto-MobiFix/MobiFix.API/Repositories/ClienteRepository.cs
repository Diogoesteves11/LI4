using System.Net.Http.Json;
using MobiFix.API.Models.GestaoUtilizadores;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class ClienteRepository : iClienteRepository
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

        var cliente = new Cliente(dto.NIF, dto.Nome, dto.Email, dto.Telefone, dto.PasswordHash);
        
        return cliente;
    }

    public async Task<bool> RegistarAsync(Cliente cliente)
    {
        var dto = new ClienteDto {
            Nome = cliente.Nome,
            NIF = cliente.Nif,
            Email = cliente.Email,
            Telefone = cliente.Contacto,
            PasswordHash = cliente.PasswordHash
        };

        var res = await _http.PostAsJsonAsync("api/Cliente", dto);
        return res.IsSuccessStatusCode;
    }

    public async Task<bool> AtualizarParcialAsync(string email, object dados)
    {
        string urlBusca = $"api/Cliente?$filter=Email eq '{email}'&$select=ClienteID";
        var resBusca = await _http.GetFromJsonAsync<DabResponse<ClienteDto>>(urlBusca);
        var clienteId = resBusca?.Value?.FirstOrDefault()?.ClienteID;

        if (clienteId == null) return false;

        string urlPatch = $"api/Cliente/ClienteID/{clienteId}";

        var request = new HttpRequestMessage(new HttpMethod("PATCH"), urlPatch);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dados);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> ExisteClienteAsync(string email)
    {
        string url = $"api/Cliente?$filter=Email eq '{email}'&$select=ClienteID&$first=1";

        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);

        if (!response.IsSuccessStatusCode) return false;

        var result = await response.Content.ReadFromJsonAsync<DabResponse<ClienteDto>>();

        return result?.Value?.Any() ?? false;
    }

}