#!/bin/bash

mkdir -p .letsencrypt

docker run -it --mount "$(pwd)/.certs:/etc/letsencrypt" --env-file .env bohendo/batua_wallet_webserver:latest
