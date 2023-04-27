FROM node:18.15.0-slim

RUN apt update && \
  apt install -y curl jq unzip gcc git
RUN curl -fsSL https://test.docker.com/ | sh

WORKDIR /works

COPY ./.yarnrc.yml ./package.json ./yarn.lock /works/
COPY ./.yarn /works/.yarn

RUN yarn install

COPY . /works/
