#!/bin/bash
set -e

echo "A iniciar DAB na porta 5000..."
dab start --config /app/dab-config.json &

# Esperar que o DAB esteja pronto
echo "A esperar pelo DAB..."
for i in $(seq 1 30); do
  if curl -s http://localhost:5000/api/Peca > /dev/null 2>&1; then
    echo "DAB pronto!"
    break
  fi
  sleep 2
done

echo "A iniciar MobiFix.API na porta 5001..."
exec dotnet MobiFix.API.dll --urls "http://+:5001"
