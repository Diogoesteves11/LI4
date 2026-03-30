#!/bin/bash

SQL_SERVER="sqlserver"
SQL_USER="sa"
SQL_PASS="SuaSenhaSegura123!"

# 1. Esperar pelo SQL Server
echo "A esperar pelo SQL Server..."
for i in $(seq 1 30); do
  if (echo > /dev/tcp/$SQL_SERVER/1433) 2>/dev/null; then
    echo "SQL Server acessivel!"
    break
  fi
  echo "  tentativa $i/30..."
  sleep 3
done

sleep 10

# 2. Correr o init.sql
if [ -f /app/init.sql ]; then
  echo "A executar init.sql..."

  mkdir -p /tmp/runsql

  cat > /tmp/runsql/RunSql.csproj << 'PROJ'
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Data.SqlClient" Version="5.2.2" />
  </ItemGroup>
</Project>
PROJ

  cat > /tmp/runsql/Program.cs << 'CODE'
using Microsoft.Data.SqlClient;

var connStr = Environment.GetEnvironmentVariable("SQL_CONN") ?? "";
var sqlFile = Environment.GetEnvironmentVariable("SQL_FILE") ?? "";
var sql = File.ReadAllText(sqlFile);
var batches = sql.Split(new[] { "\nGO\n", "\nGO\r\n", "\ngo\n", "\r\nGO\r\n" }, StringSplitOptions.RemoveEmptyEntries);

using var conn = new SqlConnection(connStr);
conn.Open();
Console.WriteLine("Ligado ao SQL Server!");

foreach (var batch in batches)
{
    var trimmed = batch.Trim();
    if (string.IsNullOrEmpty(trimmed)) continue;
    try
    {
        using var cmd = new SqlCommand(trimmed, conn);
        cmd.CommandTimeout = 30;
        cmd.ExecuteNonQuery();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"  Aviso: {ex.Message}");
    }
}
Console.WriteLine("SQL executado com sucesso!");
CODE

  export SQL_CONN="Server=$SQL_SERVER;Database=master;User Id=$SQL_USER;Password=$SQL_PASS;TrustServerCertificate=True;"
  export SQL_FILE="/app/init.sql"
  dotnet run --project /tmp/runsql || echo "Aviso: init.sql teve erros (pode ser normal se BD ja existe)"

  echo "BD inicializada!"
fi

# 3. Iniciar DAB em background
echo "A iniciar DAB na porta 5000..."
export ASPNETCORE_URLS="http://+:5000"
dab start --config /app/dab-config.json &

# 4. Esperar que o DAB esteja pronto
echo "A esperar pelo DAB..."
for i in $(seq 1 30); do
  if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo "DAB pronto!"
    break
  fi
  sleep 2
done

# 5. Iniciar a API
echo "A iniciar MobiFix.API na porta 5001..."
unset ASPNETCORE_URLS
exec dotnet MobiFix.API.dll --urls "http://+:5001"
