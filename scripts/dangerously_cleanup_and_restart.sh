#!/bin/bash

# Load the .env file variables
export $(grep -v '^#' .env | xargs)

echo "🛑 Stopping and removing containers..."
docker compose -f docker-${ENV_MODE}.yml down --remove-orphans

echo "🗑 Removing volumes..."
docker compose -f docker-${ENV_MODE}.yml down -v

if [ -n "$(docker images -q)" ]; then
    echo "🧹 Removing old Docker images..."
    docker image prune -f  # Safely removes unused images
else
    echo "⚠ No images to remove."
fi


echo "🚀 Rebuilding and starting containers in ${ENV_MODE} mode..."
docker compose -f docker-${ENV_MODE}.yml up -d --build

echo "✅ Process complete!"
