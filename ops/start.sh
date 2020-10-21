#!/bin/bash

mkdir -p .letsencrypt

docker run -it --volume="$(pwd)/.certs:/etc/letsencrypt" --env-file .env batua_wallet_webserver:latest
