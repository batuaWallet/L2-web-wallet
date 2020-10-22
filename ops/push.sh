#!/bin/bash

name="batua_wallet_webserver"
commit=$(git rev-parse HEAD | head -c 8)
me=$(whoami)

npm run build-image
docker tag "$name:latest" "$name:$commit"
docker tag "$name:$commit" "$me/$name:$commit"
docker push "$me/$name:$commit"
