#!/bin/bash

# Load the .env file variables
export $(grep -v '^#' .env | xargs)

# Rebuild and start the containers
echo "🚀 Building and starting containers in ${ENV_MODE} mode..."
docker compose -f docker-${ENV_MODE}.yml up -d --build

echo "✅ Process complete!"
