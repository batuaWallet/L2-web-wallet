#!/bin/bash

name="batua_wallet_webserver"
commit=$(git rev-parse HEAD | head -c 8)
me=$(whoami)
image="$name:$commit"

if ! grep "$commit" <<<"$(docker image ls | grep "$name")"
then
  docker pull "$me/$name:$commit"
  docker tag "$me/$name:$commit" "$name:$commit"
  docker tag "$name:$commit" "$name:latest"
fi

mkdir -p .certs

docker run \
  --name="$name" \
  --volume="$(pwd)/.certs:/etc/letsencrypt" \
  --env-file=.env \
  --publish="80:80" \
  --publish="443:443" \
  batua_wallet_webserver:latest &
