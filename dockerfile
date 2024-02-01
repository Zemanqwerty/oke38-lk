FROM --platform=linux/amd64 node:19.5.0-alpine
WORKDIR /usr/app
COPY package.json .
RUN npm i --force
EXPOSE 5000:5000
COPY . .

CMD [ "npm", "start" ]