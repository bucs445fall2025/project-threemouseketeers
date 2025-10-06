FROM node:22-bullseye AS build

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the production bundle
RUN npm run build

# --- Runtime stage ---
FROM nginx:alpine

# Copy built assets to nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]