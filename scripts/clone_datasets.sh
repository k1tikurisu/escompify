#!/bin/bash

set -Ceu

source /works/scripts/utils/progress_indicator.sh

STEPS=(
  'clone datasets'
  'copy datasets to workspace'
  'clean up'
)

CMDS=(
  'git clone https://github.com/Wakayama-SocSEL/Matsuda.git /tmp/Matsuda'
  'cp -rp /tmp/Matsuda/output/ /works/datasets/'
  'cp /works/datasets/proposal_result.json /works/runner-fose/proposal_result.json'
  'rm -rf /tmp/Matsuda'
)

start

echo "successfully cloned datasets"
