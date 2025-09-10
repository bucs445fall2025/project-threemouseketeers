

FROM node:latest-ubuntu

# This can be changed later
WORKDIR /var/app

COPY requirements.txt /var/app/.

RUN "<install cmd goes here>" 
# ^^ "npm install "

COPY . /var/app/.

EXPOSE 8080

CMD "<run cmd goes here>"


## stack is node, svelte, mysql, and caddy if we need a webserver, will set up docker compose as well.