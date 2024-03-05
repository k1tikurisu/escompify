FROM openjdk:17-jdk-slim-bullseye as builder

RUN apt-get update -y
RUN apt-get install -y unzip git

ENV LANG C.UTF-8

# https://github.com/GumTreeDiff/gumtree/wiki/Getting-Started
RUN git clone https://github.com/GumTreeDiff/gumtree.git /opt/gumtree \
  && git -C /opt/gumtree reset --hard f013c70750d5d7a11de0b14935c4e0fd0a37a906 \
  && /opt/gumtree/gradlew -p /opt/gumtree build \
  && unzip -d /opt/gumtree/dist/build/distributions /opt/gumtree/dist/build/distributions/gumtree-3.1.0-SNAPSHOT.zip

RUN git clone https://github.com/GumTreeDiff/jsparser.git /opt/jsparser \
  && git -C /opt/jsparser reset --hard e7d269f5eb86756e0add9ad6fa7ffc12435e544a

FROM node:20.11.1-slim

RUN apt-get update -y
RUN apt-get install -y openjdk-17-jre-headless

COPY --from=builder /opt/gumtree/dist/build/distributions/gumtree-3.1.0-SNAPSHOT /opt/gumtree/dist
COPY --from=builder /opt/jsparser /opt/jsparser
COPY ./jsparser /opt/jsparser/jsparser

RUN npm --prefix=/opt/jsparser/ install @babel/traverse xml-writer \
  && ln -s /opt/gumtree/dist/bin/gumtree /usr/bin/gumtree \
  && ln -s /opt/jsparser/jsparser /usr/bin/jsparser

RUN chmod +x /opt/jsparser/jsparser
