#!/bin/bash

# Define directories and files
SSL_DIR="setup/ssl"
CERT_FILE="$SSL_DIR/cert.pem"
KEY_FILE="$SSL_DIR/key.pem"
DOCKER_COMPOSE_FILE="docker-compose-setup.yml"

# Step 1: Generate SSL certificates if not already present
if [ ! -d "$SSL_DIR" ]; then
  echo "Creating SSL directory at $SSL_DIR..."
  mkdir -p "$SSL_DIR"
fi

if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
  echo "Generating SSL certificates..."
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$KEY_FILE" \
    -out "$CERT_FILE" \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"
  echo "SSL certificates generated at $SSL_DIR."
else
  echo "SSL certificates already exist. Skipping generation."
fi

# Step 2: Start the infrastructure using docker-compose
echo "Starting the infrastructure using docker-compose..."
if command -v docker-compose &> /dev/null; then
  docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
elif command -v docker compose &> /dev/null; then
  docker compose -f "$DOCKER_COMPOSE_FILE" up -d
else
  echo "Neither 'docker-compose' nor 'docker compose' is available. Please install Docker Compose."
  exit 1
fi

if [ $? -eq 0 ]; then
  echo "Infrastructure started successfully."
else
  echo "Failed to start the infrastructure. Please check the logs."
  exit 1
fi
