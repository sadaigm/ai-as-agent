#!/bin/bash

# Create a directory for SSL certificates
mkdir -p ssl

# Generate self-signed certificates
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/nginx.key \
    -out ssl/nginx.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"