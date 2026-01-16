#!/bin/bash

# Start Docker Desktop if not running
if ! docker info > /dev/null 2>&1; then
    echo "Starting Docker Desktop..."
    open -a Docker
    while ! docker info > /dev/null 2>&1; do
        sleep 1
    done
    echo "Docker is ready!"
fi

# Pull latest images and start containers
docker compose pull
docker compose up -d

# Wait for the server to be ready
echo "Waiting for server to start..."
until curl -s http://0.0.0.0:8080 > /dev/null 2>&1; do
    sleep 2
done
echo "Server is ready!"

# Open browser
open http://0.0.0.0:8080

# Follow the logs
docker compose logs -f
