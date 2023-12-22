FROM openjdk:17-jdk-slim-bullseye as builder

RUN apt-get update -y
RUN apt-get install -y unzip git

ENV LANG C.UTF-8

# https://github.com/GumTreeDiff/gumtree/wiki/Getting-Started
RUN git clone https://github.com/GumTreeDiff/gumtree.git /opt/gumtree --depth 1 \
  && /opt/gumtree/gradlew -p /opt/gumtree build \
  && unzip -d /opt/gumtree/dist/build/distributions /opt/gumtree/dist/build/distributions/gumtree-3.1.0-SNAPSHOT.zip \
  && git clone https://github.com/GumTreeDiff/jsparser.git /opt/jsparser --depth 1

FROM node:20.10.0-slim

RUN apt-get update -y
RUN apt-get install -y openjdk-17-jre-headless curl jq git
RUN curl -fsSL https://test.docker.com/ | sh

RUN npm uninstall -g yarn pnpm
RUN npm install -g corepack

WORKDIR /works

COPY ./.yarnrc.yml ./package.json ./yarn.lock /works/
COPY ./.yarn /works/.yarn
RUN corepack enable
RUN yarn install

COPY --from=builder /opt/gumtree/dist/build/distributions/gumtree-3.1.0-SNAPSHOT /opt/gumtree/dist
COPY --from=builder /opt/jsparser /opt/jsparser

RUN npm --prefix=/opt/jsparser/ install @babel/traverse xml-writer \
  && npm --prefix=/opt/jsparser uninstall acorn dash-ast \
  && ln -s /opt/gumtree/dist/bin/gumtree /usr/bin/gumtree \
  && ln -s /opt/jsparser/jsparser /usr/bin/jsparser

COPY . /works/

RUN chmod +x /works/scripts/

# webdiff
EXPOSE 4567
