FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=projectdb
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password

# Copy schema + seed data into MySQL init directory
COPY init.sql /docker-entrypoint-initdb.d/