SHELL := /bin/bash
TAG_SHA := ui_erp:$(shell git rev-parse --short HEAD 2>/dev/null || echo "latest")

# This line will set the build args from env file
DECONARGS = $(shell if [ -f .env ]; then echo "$$(for i in `cat .env`; do out+="--build-arg $$i " ; done; echo $$out;out="")"; else echo ""; fi)
GEN_ARGS = $(eval BARGS=$(DECONARGS))

.PHONY: all clean dist-prod dist-dev run-prod run-dev help

all: dist-prod

dist-prod:
    @echo "Running docker build for PROD ..."
    $(GEN_ARGS)
    docker build -f Dockerfile.prod -t $(TAG_SHA) $(BARGS) .
    @echo "Production build complete: $(TAG_SHA)"

dist-dev:
    @echo "Running docker build for DEV ..."
    $(GEN_ARGS)
    docker build -f Dockerfile.dev -t ui_erp:dev $(BARGS) .
    @echo "Development build complete: ui_erp:dev"

run-prod: dist-prod
    @echo "Running production container..."
    docker run -p 80:80 $(TAG_SHA)

run-dev: dist-dev
    @echo "Running development container..."
    docker run -p 3000:3000 -v $(PWD):/app ui_erp:dev

clean:
    @echo "Cleaning up Docker images..."
    -docker rmi $(TAG_SHA) ui_erp:dev 2>/dev/null || true
    @echo "Cleanup complete"

help:
    @echo "Available targets:"
    @echo "  all        - Default target, builds production image"
    @echo "  dist-prod  - Build production Docker image"
    @echo "  dist-dev   - Build development Docker image"
    @echo "  run-prod   - Build and run production container"
    @echo "  run-dev    - Build and run development container"
    @echo "  clean      - Remove Docker images"
    @echo "  help       - Show this help message"
