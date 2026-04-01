using DotNetEnv;
using System.Text;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

// CARREGA O FICHEIRO .ENV
DotNetEnv.Env.Load();

// Adiciona as variáveis do sistema (incluindo as do .env) ao Configuration
builder.Configuration.AddEnvironmentVariables();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var dataApiUrl = builder.Configuration["DATA_API_URL"] 
                 ?? throw new Exception("DATA_API_URL não definida");
var internalApiKey = builder.Configuration["INTERNAL_API_KEY"] 
                     ?? throw new Exception("INTERNAL_API_KEY não definida");

// 2. Criamos uma funçãozinha para configurar o cliente de forma igual
void ConfigureDefaultClient(HttpClient client)
{
    client.BaseAddress = new Uri(dataApiUrl);
    client.DefaultRequestHeaders.Add("x-api-key", internalApiKey);
}

// 3. Registamos todos os serviços usando a mesma configuração
builder.Services.AddHttpClient<IPecaService, PecaService>(ConfigureDefaultClient);
builder.Services.AddHttpClient<IAuthService, AuthService>(ConfigureDefaultClient);

// Configuração JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"]
    ?? throw new InvalidOperationException("JwtSettings:SecretKey não está configurado.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();