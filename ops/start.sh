#!/bin/bash

name="batua_wallet_webserver"
commit=$(git rev-parse HEAD | head -c 8)
registry="${DOCKER_REGISTRY:-$(whoami)}"

if ! grep "$commit" <<<"$(docker image ls | grep "$name")"
then
  echo "Pulling $registry/$name:$commit"
  docker pull "$registry/$name:$commit"
  docker tag "$registry/$name:$commit" "$name:$commit"
  docker tag "$name:$commit" "$name:latest"
fi

if grep "$name" <<<"$(docker container ls --filter 'status=running' --format '{{.Names}}')"
then
  echo "Stopping container $name"
  docker container stop $name
  docker container rm $name
fi

certs_dir="$(pwd)/.certs"
mkdir -p "$certs_dir"

docker run \
  --name="$name" \
  --volume="$certs_dir:/etc/letsencrypt" \
  --env-file=.env \
  --publish="80:80" \
  --publish="443:443" \
  "$name:$commit" &
