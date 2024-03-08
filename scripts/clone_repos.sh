#!/bin/sh

cd /works
if [ -d "repos" ]; then
  echo "repos are already cloned"
  exit 0
fi

mkdir -p repos
jq -r "[.[].nameWithOwner] | unique | .[]" ./datasets/proposal_result.json |\
  xargs -i bash -c "git clone https://github.com/{}.git repos/{} && echo wait 1s && sleep 1";\
  exit 0
