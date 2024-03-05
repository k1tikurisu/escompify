#!/bin/bash

set -Ceu

source ./scripts/utils/progress_indicator.sh

STEPS=(
  'clone datasets'
  'copy datasets to workspace'
  'clean up'
)

CMDS=(
  'git clone https://github.com/Wakayama-SocSEL/Matsuda.git /tmp/Matsuda'
  'cp -rp /tmp/Matsuda/output/ ./datasets/'
  'rm -rf /tmp/Matsuda'
)

start

echo "successfully cloned datasets"
