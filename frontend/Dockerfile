ARG API_HOST

# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
ENV NEXT_PUBLIC_BACKEND_API_HOST=${API_HOST}

# ---- Dependencies ----
FROM base AS dependencies
RUN npm ci

# ---- Build ----
FROM dependencies AS build
COPY . .
RUN npx next telemetry disable

# USER node
EXPOSE 8000

# Start the application
CMD ["npm", "run", "dev"]
