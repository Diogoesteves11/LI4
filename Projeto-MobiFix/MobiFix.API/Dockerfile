FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY MobiFix.API.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app

# Runtime com SDK (precisa do SDK para correr o DAB tool)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS runtime
WORKDIR /app

# Instalar DAB
RUN dotnet tool install -g Microsoft.DataApiBuilder
ENV PATH="$PATH:/root/.dotnet/tools"

COPY --from=build /app .

EXPOSE 5001 5000

# Script de arranque: DAB em background + API
COPY start.sh .
RUN chmod +x start.sh

ENTRYPOINT ["./start.sh"]
