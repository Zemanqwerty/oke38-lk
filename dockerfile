FROM --platform=linux/amd64 node:19.5.0-alpine
WORKDIR /usr/app
COPY package.json .
RUN npm i --force
EXPOSE 5010:5010
COPY . .

CMD [ "npm", "start" ]