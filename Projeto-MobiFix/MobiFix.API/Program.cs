using System.Net.Http;

var builder = WebApplication.CreateBuilder(args);

// Prepara o .NET para usar a pasta Controllers
builder.Services.AddControllers();

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Encaminha os pedidos HTTP para os teus Controllers
app.MapControllers();

app.Run();