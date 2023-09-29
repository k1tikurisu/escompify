FROM openjdk:17-jdk-slim-bullseye as builder

RUN apt-get update -y
RUN apt-get install -y unzip git curl gcc

ENV LANG C.UTF-8

# https://github.com/GumTreeDiff/gumtree/wiki/Getting-Started
RUN git clone https://github.com/GumTreeDiff/gumtree.git /opt/gumtree --depth 1 \
  && /opt/gumtree/gradlew -p /opt/gumtree build \
  && unzip -d /opt/gumtree/dist/build/distributions /opt/gumtree/dist/build/distributions/gumtree-3.1.0-SNAPSHOT.zip \
  && git clone https://github.com/GumTreeDiff/jsparser.git /opt/jsparser --depth 1

# https://sqlite.org/howtocompile.html
RUN curl https://www.sqlite.org/2023/sqlite-amalgamation-3430100.zip -o /opt/sqlite3.zip \
  && unzip -d /opt/sqlite3 /opt/sqlite3.zip \
  && cd /opt/sqlite3/sqlite-amalgamation-3430100 \
  && gcc -o sqlite3 -DSQLITE_THREADSAFE=0 -DSQLITE_OMIT_LOAD_EXTENSION shell.c sqlite3.c


FROM openjdk:17-jdk-slim-bullseye

RUN apt-get update -y
RUN apt-get install -y curl jq git
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y nodejs \
  && curl -fsSL https://test.docker.com/ | sh

RUN npm uninstall -g yarn pnpm
RUN npm install -g corepack

WORKDIR /works

COPY ./.yarnrc.yml ./package.json ./yarn.lock /works/
COPY ./.yarn /works/.yarn
RUN corepack enable
RUN yarn install

COPY --from=builder /opt/gumtree/dist/build/distributions/gumtree-3.1.0-SNAPSHOT /opt/gumtree/dist
COPY --from=builder /opt/jsparser /opt/jsparser
COPY --from=builder /opt/sqlite3/sqlite-amalgamation-3430100/sqlite3 /usr/bin/sqlite3

RUN npm --prefix=/opt/jsparser/ install @babel/parser @babel/traverse xml-writer \
  && npm --prefix=/opt/jsparser uninstall acorn dash-ast \
  && ln -s /opt/gumtree/dist/bin/gumtree /usr/bin/gumtree \ 
  && ln -s /opt/jsparser/jsparser /usr/bin/jsparser 

COPY . /works/

RUN chmod +x /works/scripts/

# webdiff
EXPOSE 4567
