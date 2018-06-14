FROM node:10

RUN apt-get update

RUN apt-get install build-essential

RUN rm -rf /var/lib/apt/lists/*

RUN npm install -g webpack webpack-dev-server yarn node-gyp

VOLUME /app

EXPOSE 3000

WORKDIR /app
