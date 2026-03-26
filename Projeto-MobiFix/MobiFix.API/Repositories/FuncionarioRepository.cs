using System.Net.Http.Json;
using MobiFix.API.Models.GestaoUtilizadores;

namespace MobiFix.API.Repositories;

public class FuncionarioRepository : iFuncionarioRepository {
    private readonly HttpClient _http;

    public FuncionarioRepository(HttpClient http) => _http = http;

    public async Task<Funcionario?> GetByNumeroAsync(string numero) {
        strint url = 
    }

}