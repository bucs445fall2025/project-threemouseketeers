FROM node:24

# This can be changed later
WORKDIR /api

COPY ./package.json ./package.json
RUN npm install

COPY . /api/.

EXPOSE 8080

CMD ["node", "password_storage.js"]
#CMD ["node", "create_user.js"]