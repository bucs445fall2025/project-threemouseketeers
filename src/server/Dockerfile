FROM mysql:8.0

#env variables have been moved to .env file for security reasons

# Copy schema + seed data into MySQL init directory
COPY init.sql /docker-entrypoint-initdb.d/