#!/bin/bash

name="batua_wallet_webserver"
commit=$(git rev-parse HEAD | head -c 8)
registry="${DOCKER_REGISTRY:-$(whoami)}"

npm run build
echo "Tagging $name:$commit"
docker tag "$name:latest" "$name:$commit"
echo "Tagging $registry/$name:$commit"
docker tag "$name:$commit" "$registry/$name:$commit"
echo "Pushing $registry/$name:$commit"
docker push "$registry/$name:$commit"
