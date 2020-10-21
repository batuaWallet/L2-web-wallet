#!/bin/bash

mkdir -p .letsencrypt

docker run \
  --volume="$(pwd)/.certs:/etc/letsencrypt" \
  --env-file=.env \
  --publish="80:80" \
  --publish="443:443" \
  batua_wallet_webserver:latest &
