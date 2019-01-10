FROM node:10.5

ENV HOME /root

WORKDIR /opt/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]