#!/usr/bin/env bash

find ../snapp-frontend -type d -name 'node_modules' -prune -exec rm -rf {} \;
rm -rf ../snapp-frontend/.cache-loader
rm -rf ../snapp-frontend/public/dist
