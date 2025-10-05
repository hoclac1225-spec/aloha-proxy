# ===========================
# Stage 1: Builder
# ===========================
FROM node:20-alpine AS builder
WORKDIR /app

# Tận dụng cache: copy package.json và package-lock.json trước
COPY package*.json ./

# Cài dependencies và chạy postinstall (patch Shopify)
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Chạy build Remix
RUN npm run build

# ===========================
# Stage 2: Runner
# ===========================
FROM node:20-alpine AS runner
WORKDIR /app

# Thiết lập biến môi trường
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Copy node_modules từ builder
COPY --from=builder /app/node_modules ./node_modules

# Copy build và runtime assets
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# Copy entrypoint và cấp quyền thực thi
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Mở cổng mặc định
EXPOSE 3000

# Entrypoint
ENTRYPOINT ["./entrypoint.sh"]
