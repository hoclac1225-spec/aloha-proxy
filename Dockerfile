# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# copy và cài dependencies
COPY package*.json ./
RUN npm ci

# copy toàn bộ source
COPY . .

# build nếu cần (Remix)
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# copy node_modules từ builder
COPY --from=builder /app/node_modules ./node_modules

# copy build & runtime assets
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
