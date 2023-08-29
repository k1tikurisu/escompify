FROM node:18.15.0-slim

RUN apt update && \
  apt install -y curl jq unzip gcc git sshpass
RUN curl -fsSL https://test.docker.com/ | sh

# https://sqlite.org/howtocompile.html
RUN curl https://www.sqlite.org/2021/sqlite-amalgamation-3350500.zip -o sqlite.zip &&\
  unzip sqlite.zip &&\
  cd sqlite-amalgamation-3350500 &&\
  gcc -DSQLITE_THREADSAFE=0 -DSQLITE_OMIT_LOAD_EXTENSION shell.c sqlite3.c &&\
  mv ./a.out /usr/local/bin/sqlite3 &&\
  rm -rf /sqlite.zip /sqlite-amalgamation-3350500

WORKDIR /works

COPY ./.yarnrc.yml ./package.json ./yarn.lock /works/
COPY ./.yarn /works/.yarn

RUN yarn install

COPY . /works/

RUN chmod +x /works/scripts/
