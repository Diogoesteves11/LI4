using System.Net.Http.Json;
using MobiFix.API.DTOs;
using System.Text.Json;

namespace MobiFix.API.Repositories;

public class TrotineteRepository : ITrotineteRepository
{
    private readonly HttpClient _http;

    public TrotineteRepository(HttpClient http) => _http = http;

    public async Task<TrotineteDto?> ObterPorSerieAsync(string numSerie)
    {
        string url = $"api/Trotinete?$filter=NumeroSerie eq '{numSerie}'";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        var result = await response.Content.ReadFromJsonAsync<DabResponse<TrotineteDto>>();
        return result?.Value?.FirstOrDefault();
    }

public async Task<bool> CriarComEmailAsync(TrotineteDto dto, string email)
{
    int? clienteId = await ObterIdClientePorEmail(email);
    if (clienteId == null) return false;

    var body = new
    {
        NumeroSerie = dto.NumeroSerie,
        Marca = dto.Marca,
        Modelo = dto.Modelo,
        EmServico = dto.EmServico,
        ClienteID = clienteId.Value
    };

    var request = new HttpRequestMessage(HttpMethod.Post, "api/Trotinete");
    request.Headers.Add("X-MS-API-ROLE", "Administrador");

    var options = new JsonSerializerOptions { PropertyNamingPolicy = null };
    
    request.Content = JsonContent.Create(body, options: options);

    var res = await _http.SendAsync(request);
    
    if (!res.IsSuccessStatusCode)
    {
        var erroDab = await res.Content.ReadAsStringAsync();
        throw new Exception($"FALHA NO DAB (Trotinete): Código {res.StatusCode} | Detalhe: {erroDab}");
    }

    return true;
}

    public async Task<bool> AtualizarPorSerieAsync(string numSerie, object dados)
    {
        var trotinete = await ObterPorSerieAsync(numSerie);
        if (trotinete == null) return false;

        string urlPatch = $"api/Trotinete/TrotineteID/{trotinete.TrotineteID}";
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), urlPatch);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dados);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> AlterarEstadoTrotinete(string numSerie, bool estado)
    {
        return await AtualizarPorSerieAsync(numSerie, new { EmServico = estado });
    }

    private async Task<int?> ObterIdClientePorEmail(string email)
    {
        string url = $"api/Cliente?$filter=Email eq '{email}'&$select=ClienteID";
        var req = new HttpRequestMessage(HttpMethod.Get, url);
        req.Headers.Add("X-MS-API-ROLE", "Administrador");

        var res = await _http.SendAsync(req);
        if (!res.IsSuccessStatusCode) return null;

        var envelope = await res.Content.ReadFromJsonAsync<DabResponse<ClienteDto>>();
        return envelope?.Value?.FirstOrDefault()?.ClienteID;
    }
}
