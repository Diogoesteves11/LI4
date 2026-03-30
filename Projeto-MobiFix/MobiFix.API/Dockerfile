FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY MobiFix.API.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS runtime
WORKDIR /app

RUN apt-get update -qq && \
    apt-get install -y -qq curl && \
    dotnet tool install -g Microsoft.DataApiBuilder && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV PATH="$PATH:/root/.dotnet/tools"

COPY --from=build /app .

EXPOSE 5001 5000

COPY start.sh .
RUN chmod +x start.sh

ENTRYPOINT ["./start.sh"]
