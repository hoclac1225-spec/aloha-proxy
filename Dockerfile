# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- final/runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# generate prisma client
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; fi

# port
EXPOSE 3000

# chạy migrate khi container start
CMD npx prisma migrate deploy && npm run start
