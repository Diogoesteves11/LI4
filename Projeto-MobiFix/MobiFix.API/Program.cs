using MobiFix.API.Repositories;
using MobiFix.API.Services.GestaoUtilizadores;
using MobiFix.API.Services.GestaoServicos;
using MobiFix.API.Services.GestaoStocks;
using MobiFix.API.Services.GestaoFinanceira;
using MobiFix.API.Services.GestaoAgenda;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ─── Controllers ───
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// ─── DAB HttpClient (base URL do Data API Builder) ───
var dabBaseUrl = builder.Configuration["DabSettings:BaseUrl"] ?? "http://localhost:5000";

void ConfigureDabClient(HttpClient client)
{
    client.BaseAddress = new Uri(dabBaseUrl);
}

// ─── Repositórios (HttpClient -> DAB) ───
builder.Services.AddHttpClient<IClienteRepository, ClienteRepository>(ConfigureDabClient);
builder.Services.AddHttpClient<IFuncionarioRepository, FuncionarioRepository>(ConfigureDabClient);
builder.Services.AddHttpClient<ITrotineteRepository, TrotineteRepository>(ConfigureDabClient);
builder.Services.AddHttpClient<IPecaRepository, PecaRepository>(ConfigureDabClient);
builder.Services.AddHttpClient<IServicoRepository, ServicoRepository>(ConfigureDabClient);
builder.Services.AddHttpClient<IServicoIntervencaoRepository, ServicoIntervencaoRepository>(ConfigureDabClient);
builder.Services.AddHttpClient<ICatalogoIntervencoesRepository, CatalogoIntervencoesRepository>(ConfigureDabClient);
builder.Services.AddHttpClient<IFaturaRepository, FaturaRepository>(ConfigureDabClient);
builder.Services.AddHttpClient<IDevolucaoRepository, DevolucaoRepository>(ConfigureDabClient);
builder.Services.AddHttpClient<INotaCreditoRepository, NotaCreditoRepository>(ConfigureDabClient);
builder.Services.AddHttpClient<IPromocaoRepository, PromocaoRepository>(ConfigureDabClient);
builder.Services.AddHttpClient<IEncomendaClienteRepository, EncomendaClienteRepository>(ConfigureDabClient);
builder.Services.AddHttpClient<IEncomendaStockRepository, EncomendaStockRepository>(ConfigureDabClient);
builder.Services.AddHttpClient<IAgendaRepository, AgendaRepository>(ConfigureDabClient);

// ─── Serviços (Lógica de Negócio) ───
builder.Services.AddScoped<IGestaoUtilizadores, UtilizadoresService>();
builder.Services.AddScoped<IGestaoServicos, ServicosService>();
builder.Services.AddScoped<IGestaoStocks, StockService>();
builder.Services.AddScoped<IGestaoFinancas, FinancasService>();
builder.Services.AddScoped<IGestaoAgenda, AgendaService>();

// ─── JWT Authentication ───
var jwtKey = builder.Configuration["Jwt:Key"] ?? "MobiFixSecretKey2024MobiFixSecretKey2024";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "MobiFix.API",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "MobiFix.Frontend",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// ─── CORS ───
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
