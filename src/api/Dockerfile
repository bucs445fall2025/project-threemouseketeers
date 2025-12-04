FROM node:jod-alpine3.21

# This can be changed later
WORKDIR /api

COPY ./package.json ./package.json
RUN npm install

COPY . /api/.

EXPOSE 8080

CMD ["node", "api.js"]