#!/bin/bash

# Stop on errors
set -e

echo "Building React app..."
npm run build

echo "Building Docker image..."
docker build -t ai-agent-ui .

echo "Starting Docker container(s)..."
docker-compose down || true
docker-compose up -d

echo "Deployment complete!"
echo "Your application is running at http://localhost:5000"
echo "Note: It may take a few seconds to start up."