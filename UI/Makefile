SHELL := /bin/bash
# this line will set the build args from env file
DECONARGS = $(shell echo "$$(for i in `cat .env`; do out+="--build-arg $$i " ; done; echo $$out;out="")")
GEN_ARGS = $(eval BARGS=$(DECONARGS))

.PHONY: dist-prod
dist-prod:
    @echo "Running docker build for PROD ..."
        $(GEN_ARGS)
    docker build -f Dockerfile.prod -t ui_erp $(BARGS) .