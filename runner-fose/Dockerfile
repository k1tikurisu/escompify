FROM node:18.15.0-slim

RUN apt update && apt install -y git jq

WORKDIR /works
COPY ./proposal_result.json /works/

RUN jq -r "[.[].nameWithOwner] | unique | .[]" ./proposal_result.json |\
  xargs -i bash -c "git clone https://github.com/{}.git repos/{} && echo wait 1s && sleep 1";\
  exit 0

COPY . /works/
