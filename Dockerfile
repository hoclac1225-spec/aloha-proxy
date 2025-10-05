# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./ 
COPY scripts ./scripts
RUN npm ci

COPY . .
RUN npm run build

# --- runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json ./ 
COPY scripts ./scripts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/server.js ./server.js
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
