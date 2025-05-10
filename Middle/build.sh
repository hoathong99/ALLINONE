#!/bin/bash

# Set variables
TAG_SHA="middle_api:$(git rev-parse --short HEAD 2>/dev/null || echo "latest")"

# Function to load environment variables from .env file
load_env_args() {
  if [ -f .env ]; then
    BUILD_ARGS=""
    while IFS= read -r line || [[ -n "$line" ]]; do
      if [[ ! -z "$line" && ! "$line" =~ ^# ]]; then
        BUILD_ARGS="$BUILD_ARGS --build-arg $line"
      fi
    done < .env
    echo "$BUILD_ARGS"
  else
    echo ""
  fi
}

# Get build arguments
BUILD_ARGS=$(load_env_args)

# Display help
show_help() {
  echo "Usage: ./build.sh [command]"
  echo ""
  echo "Commands:"
  echo "  prod         Build production Docker image"
  echo "  dev          Build development Docker image"
  echo "  run-prod     Build and run production container"
  echo "  run-dev      Build and run development container"
  echo "  clean        Remove Docker images"
  echo "  help         Show this help message"
  echo ""
  echo "Example: ./build.sh prod"
}

# Build production image
build_prod() {
  echo "Building production image: $TAG_SHA"
  docker build -f Dockerfile.prod -t "$TAG_SHA" $BUILD_ARGS .
  echo "Production build complete"
}

# Build development image
build_dev() {
  echo "Building development image: middle_api:dev"
  docker build -f Dockerfile.dev -t middle_api:dev $BUILD_ARGS .
  echo "Development build complete"
}

# Run production container
run_prod() {
  build_prod
  echo "Running production container..."
  docker run -p 3000:3000 "$TAG_SHA"
}

# Run development container
run_dev() {
  build_dev
  echo "Running development container..."
  docker run -p 3000:3000 -v "$(pwd):/app" middle_api:dev
}

# Clean up Docker images
clean() {
  echo "Cleaning up Docker images..."
  docker rmi "$TAG_SHA" middle_api:dev 2>/dev/null || true
  echo "Cleanup complete"
}

# Process command line arguments
case "$1" in
  prod)
    build_prod
    ;;
  dev)
    build_dev
    ;;
  run-prod)
    run_prod
    ;;
  run-dev)
    run_dev
    ;;
  clean)
    clean
    ;;
  help|*)
    show_help
    ;;
esac