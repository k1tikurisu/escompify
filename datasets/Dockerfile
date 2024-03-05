FROM node:20.11.1-slim

RUN apt-get update -y
RUN apt-get install -y git jq

WORKDIR /works

COPY ./proposal_result.json .

ARG repos

RUN jq -r "[.[].nameWithOwner] | unique | .[]" /works/proposal_result.json |\
  xargs -i bash -c "git clone https://github.com/{}.git repos/{} && echo wait 1s && sleep 1";\
  exit 0
