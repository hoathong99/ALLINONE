SHELL := /bin/bash
TAG_SHA := ui_erp:$(shell git rev-parse --short HEAD 2>/dev/null || echo "latest")

# Build args from env file
DECONARGS = $(shell if [ -f .env ]; then echo "$$(for i in `cat .env`; do out+="--build-arg $$i " ; done; echo $$out;out="")"; else echo ""; fi)
GEN_ARGS = $(eval BARGS=$(DECONARGS))

.PHONY: all dist-prod dist-dev run-prod run-dev clean help

all: dist-prod

dist-prod:
    @echo "Building production image..."
    $(GEN_ARGS)
    docker build -f Dockerfile.prod -t $(TAG_SHA) $(BARGS) .

dist-dev:
    @echo "Building development image..."
    $(GEN_ARGS)
    docker build -f Dockerfile.dev -t ui_erp:dev $(BARGS) .

run-prod: dist-prod
    docker run -p 80:80 $(TAG_SHA)

run-dev: dist-dev
    docker run -p 3000:3000 -v $(PWD):/app ui_erp:dev

clean:
    -docker rmi $(TAG_SHA) ui_erp:dev 2>/dev/null || true

help:
    @echo "Available targets: all, dist-prod, dist-dev, run-prod, run-dev, clean, help"
