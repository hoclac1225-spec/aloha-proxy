# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /app

# copy package files and scripts early
COPY package*.json ./
COPY scripts ./scripts

# install deps (dev + prod) for build
RUN npm ci

# copy source & build
COPY . .
RUN npm run build

# --- runner/runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

# set production env by default
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# optional DB arg passed during build time
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# copy package.json and scripts (for consistency)
COPY package*.json ./
COPY scripts ./scripts

# copy production node_modules from builder (faster & consistent)
COPY --from=builder /app/node_modules ./node_modules

# copy build and runtime assets
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/server.js ./server.js

# copy entrypoint and make executable
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
