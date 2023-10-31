# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./


# ---- Dependencies ----
FROM base AS dependencies
RUN npm ci

# ---- Build ----
FROM dependencies AS build
COPY . .
RUN npx next telemetry disable
RUN npm run bulid

# ---- Production ----
FROM node:20-alpine AS production

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.js ./next.config.js

RUN npx next telemetry disable

EXPOSE 8000

# Start the application
CMD ["npm", "start"]
