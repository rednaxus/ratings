FROM node:10

RUN npm install -g webpack webpack-dev-server yarn

VOLUME /app

EXPOSE 3000

WORKDIR /app