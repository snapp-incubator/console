#!/usr/bin/env bash

set -e

pushd ../snapp-frontend
yarn install
yarn run build
popd
