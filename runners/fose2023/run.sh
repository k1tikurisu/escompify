#!/bin/bash

set -Ceu

/works/scripts/clone_repos.sh

yarn ts-node -r tsconfig-paths/register /works/runners/fose2023/runner.ts

echo "successfully output fose2023 results"
