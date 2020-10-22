#!/bin/bash

name="batua_wallet_webserver"
commit=$(git rev-parse HEAD | head -c 8)
me=$(whoami)

docker pull "$me/$name:$commit"
docker tag "$me/$name:$commit" "$name:$commit"
docker tag "$name:$commit" "$name:latest"
