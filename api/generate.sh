#!/bin/bash

set -e

# Fetch the latest hapi spec
rm -rf hapi && git clone https://github.com/spectrocloud/hapi
(
    cd hapi
    bash generate_hubble_spec.sh
    go run api/main.go
    cp gen/docs-spec/palette-apis-spec.json ..
    rm -rf hapi
)
