FROM node:4.4.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

WORKDIR /usr/src/app/node_modules/wdio-mocha-framework
RUN npm install
RUN node_modules/.bin/grunt build

WORKDIR /usr/src/app
COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "start" ]
