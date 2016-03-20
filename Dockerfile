FROM node:4-onbuild

EXPOSE 3000

WORKDIR /usr/src/app/node_modules/wdio-mocha-framework
RUN npm install
RUN node_modules/.bin/grunt build

WORKDIR /usr/src/app
