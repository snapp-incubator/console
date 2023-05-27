#!/usr/bin/env bash

set -e

pushd ../snapp-dynamic-demo-plugin
yarn install
yarn run build
popd
