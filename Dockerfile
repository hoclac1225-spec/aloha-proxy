# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /app

# copy package jsons and scripts early so postinstall script exists during npm ci
COPY package*.json ./
COPY scripts ./scripts

# install all deps (dev + prod) for build
RUN npm ci

# copy rest of source & build
COPY . .
RUN npm run build

# --- runner/runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

# set production env by default
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# set optional database arg
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# copy package.json & scripts (so postinstall won't fail if run)
COPY package*.json ./
COPY scripts ./scripts

# install only production deps (postinstall will run but scripts exists)
RUN npm ci --omit=dev

# copy build output and public assets from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# copy any other runtime files you need (server.js, etc.)
COPY server.js ./server.js

# copy entrypoint (below content provided) and make executable
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

# start
ENTRYPOINT ["./entrypoint.sh"]
