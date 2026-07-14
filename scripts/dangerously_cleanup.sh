#!/bin/bash
# Load the .env file variables
export $(grep -v '^#' .env | xargs)

echo "🛑 Stopping and removing containers..."
docker compose -f docker-${ENV_MODE}.yml down --remove-orphans

echo "🗑 Removing volumes..."
docker compose -f docker-${ENV_MODE}.yml down -v

echo "🧹 Removing all Docker images..."
docker rmi $(docker images -q)

echo "✅ Ceanup complete!"
