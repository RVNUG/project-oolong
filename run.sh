#!/bin/bash

# Make this script executable with: chmod +x run.sh

case "$1" in
  start)
    echo "Starting Gatsby development server..."
    docker-compose up
    ;;
  build)
    echo "Building Gatsby site..."
    docker-compose run --rm gatsby gatsby build
    ;;
  clean)
    echo "Cleaning Gatsby cache..."
    docker-compose run --rm gatsby gatsby clean
    ;;
  shell)
    echo "Opening a shell into the container..."
    docker-compose run --rm gatsby /bin/bash
    ;;
  *)
    echo "Usage: ./run.sh {start|build|clean|shell}"
    exit 1
esac 