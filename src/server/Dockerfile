FROM mysql:8.0

#env variables have been moved to .env file for security reasons

# Copy schema + seed data into MySQL init directory
COPY init.sql /docker-entrypoint-initdb.d/

# enter db with >> mysql -h 127.0.0.1 -P 3306 -u<user> -p<password> projectdb