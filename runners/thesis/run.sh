#!/bin/bash

set -Ceu

/works/scripts/clone_repos.sh

yarn build
yarn ts-node -r tsconfig-paths/register /works/runners/thesis/runner.ts

echo "successfully output thesis results"
