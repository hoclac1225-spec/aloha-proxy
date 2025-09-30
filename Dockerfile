# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /app

# copy package.json và package-lock.json, cài dev deps
COPY package*.json ./
RUN npm ci

# copy toàn bộ code và build
COPY . .
RUN npm run build

# --- final/runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

# Thiết lập biến môi trường DATABASE_URL, có thể truyền khi build
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# copy package.json và cài production deps
COPY package*.json ./
RUN npm ci --omit=dev

# copy build, public và prisma schema từ builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Chạy migrate khi container start, tránh lỗi lúc build
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
CMD ["./entrypoint.sh"]
