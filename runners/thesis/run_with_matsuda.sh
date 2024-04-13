#!/bin/bash

set -Ceu

yarn build
yarn ts-node -r tsconfig-paths/register ./runners/thesis/runnerWithMatsuda.ts

echo "successfully output thesis results"
