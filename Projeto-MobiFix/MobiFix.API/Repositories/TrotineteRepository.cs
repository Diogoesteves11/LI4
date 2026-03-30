using System.Net.Http.Json;
using MobiFix.API.Models.GestaoServicos;
using MobiFix.API.DTOs;

namespace MobiFix.API.Repositories;

public class TrotineteRepository : iTrotineteRepository
{
    private readonly HttpClient _http;

    public TrotineteRepository(HttpClient http) => _http = http;

    public async Task<TrotineteDto?> ObterPorSerieAsync(string numSerie)
    {
        string url = $"api/Trotinete?$filter=NumeroSerie eq '{numSerie}'";

        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");

        var response = await _http.SendAsync(request);
        var result = await response.Content.ReadFromJsonAsync<DabResponse<TrotineteDto>>();
        
        return result?.Value?.FirstOrDefault();
    }

    public async Task<bool> CriarComNifAsync(Trotinete t, string nif)
    {   
        TrotineteDto dto = new TrotineteDto(
            NumeroSerie = t.NumeroSerie,
            Marca = t.Marca,
            Modelo = t.Modelo,
            EmServico = t.emServico
        );

        int? clienteId = await ObterIdClientePorNif(nif);
        if (clienteId == null) return false;

        dto.ClienteID = clienteId.Value;

        var request = new HttpRequestMessage(HttpMethod.Post, "api/Trotinete");
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dto);

        var res = await _http.SendAsync(request);
        return res.IsSuccessStatusCode;
    }

    public async Task<bool> AtualizarPorSerieAsync(string numSerie, object dadosParaMudar)
    {
        var trotinete = await ObterPorSerieAsync(numSerie);
        if (trotinete == null) return false;

        string urlPatch = $"api/Trotinete/TrotineteID/{trotinete.TrotineteID}";
        
        var request = new HttpRequestMessage(new HttpMethod("PATCH"), urlPatch);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dadosParaMudar);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> AlterarEstadoTrotinete(string numSerie, bool estado)
    {
        string urlBusca = $"api/Trotinete?$filter=NumeroSerie eq '{numSerie}'&$select=TrotineteID";

        var reqBusca = new HttpRequestMessage(HttpMethod.Get, urlBusca);
        reqBusca.Headers.Add("X-MS-API-ROLE", "Administrador");

        var resBusca = await _http.SendAsync(reqBusca);
        if (!resBusca.IsSuccessStatusCode) return false;

        var envelope = await resBusca.Content.ReadFromJsonAsync<DabResponse<TrotineteDto>>();
        var idTecnico = envelope?.Value?.FirstOrDefault()?.TrotineteID;

        if (idTecnico == null) return false;

        string urlPatch = $"api/Trotinete/TrotineteID/{idTecnico}";

        var dadosParaMudar = new { EmServico = estado }; 

        var request = new HttpRequestMessage(new HttpMethod("PATCH"), urlPatch);
        request.Headers.Add("X-MS-API-ROLE", "Administrador");
        request.Content = JsonContent.Create(dadosParaMudar);

        var response = await _http.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    private async Task<int?> ObterIdClientePorEmail(string email)
    {
        string url = $"api/Cliente?$filter=Email eq '{email}'&$select=ClienteID";
        
        var req = new HttpRequestMessage(HttpMethod.Get, url);
        req.Headers.Add("X-MS-API-ROLE", "Administrador");

        var res = await _http.SendAsync(req);
        var envelope = await res.Content.ReadFromJsonAsync<DabResponse<ClienteDto>>();
        
        return envelope?.Value?.FirstOrDefault()?.ClienteID;
    }
}