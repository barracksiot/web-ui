#!/usr/bin/env bash

set -ex

COMMAND=$1

docker build -t ${npm_package_dockerRegistry}/${npm_package_name}:${npm_package_version}-${npm_package_build} .
if [[ "$COMMAND" == "push" ]]; then
  docker tag -f ${npm_package_dockerRegistry}/${npm_package_name}:${npm_package_version}-${npm_package_build} ${npm_package_dockerRegistry}/${npm_package_name}:${npm_package_version}
  docker push ${npm_package_dockerRegistry}/${npm_package_name}
fi
