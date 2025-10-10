FROM node:22-bullseye

WORKDIR /app

COPY package*.json ./
RUN ls -la /app
RUN npm install

COPY . .


EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]