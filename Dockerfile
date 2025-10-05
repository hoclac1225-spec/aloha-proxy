# --- builder stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# copy package.json early to cache deps
COPY package*.json ./ 
COPY scripts ./scripts

# install all deps
RUN npm ci

# copy source code
COPY . .

# build Remix
RUN npm run build

# --- runner stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# copy package.json & scripts
COPY package*.json ./ 
COPY scripts ./scripts

# copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# copy build & runtime assets
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js ./server.js

# copy entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
