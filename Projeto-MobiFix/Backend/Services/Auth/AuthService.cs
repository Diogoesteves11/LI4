namespace Backend.Services;

using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using Backend.Models;
using Microsoft.IdentityModel.Tokens;

public class AuthService: IAuthService 
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public AuthService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

public async Task<string?> LoginAsync(FuncionarioLoginDto loginDto)
{
    // Procura no .env por INTERNAL_API_KEY
    var apiKey = _configuration["INTERNAL_API_KEY"] 
                 ?? throw new InvalidOperationException("INTERNAL_API_KEY não encontrada no .env");

    _httpClient.DefaultRequestHeaders.Remove("x-api-key");
    _httpClient.DefaultRequestHeaders.Add("x-api-key", apiKey);

    var url = $"funcionarios/{loginDto.NumeroMecanografico}";
    var funcionario = await _httpClient.GetFromJsonAsync<FuncionarioDto>(url);

    if (funcionario is null) return null;

    bool passwordValida = BCrypt.Net.BCrypt.Verify(loginDto.Password, funcionario.PasswordHash);
    if (!passwordValida) return null;

    return GerarToken(funcionario);
}

private string GerarToken(FuncionarioDto funcionario)
{
    // Procura no .env por JWT_SECRET
    var secretKey = _configuration["JWT_SECRET"]
        ?? throw new InvalidOperationException("JWT_SECRET não encontrada no .env");

    var claims = new[]
    {
        new Claim("id", funcionario.NumeroMecanografico),
        new Claim("nome", funcionario.Nome),
        new Claim("cargo", funcionario.Cargo)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        // Podes meter estes valores no .env também ou deixar fixos
        issuer: "MobiFixBackend", 
        audience: "MobiFixFrontend",
        claims: claims,
        expires: DateTime.UtcNow.AddHours(8),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
}