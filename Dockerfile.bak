# ===============================
# Stage 1: Build
# ===============================
FROM node:20-alpine AS builder

# Thư mục làm việc
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Cài tất cả dependencies (bao gồm devDependencies)
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Build Remix app
RUN npm run build

# ===============================
# Stage 2: Production
# ===============================
FROM node:20-alpine

WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Cài chỉ runtime dependencies
RUN npm ci --omit=dev

# Copy folder build từ stage builder
COPY --from=builder /app/build ./build

# Copy file server cần thiết (nếu có)
COPY --from=builder /app/remix.config.js ./remix.config.js
COPY --from=builder /app/public ./public

# Thiết lập biến môi trường Render (bạn có thể set trong dashboard Render)
# ENV SHOPIFY_APP_URL=https://aloha-proxy.onrender.com

# Port mặc định Render
ENV PORT=10000

# Start app
CMD ["npm", "run", "docker-start"]
