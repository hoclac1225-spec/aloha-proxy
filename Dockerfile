# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /app

# copy package.json và cài dev deps
COPY package*.json ./
RUN npm ci

# copy toàn bộ code và build
COPY . .
RUN npm run build

# --- runner/runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

# thiết lập biến môi trường database
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# copy package.json và cài production deps
COPY package*.json ./
RUN npm ci --omit=dev

# copy build, public và prisma từ builder
COPY --from=builder /app/build ./build

# Copy file server cần thiết (nếu có)
# NOTE: runtime copy of remix.config.js intentionally removed to fix Docker build

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# copy entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# expose port
EXPOSE 3000

# chạy entrypoint khi container start
ENTRYPOINT ["./entrypoint.sh"]