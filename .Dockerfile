# ===============================
# Stage 1: Build
# ===============================
FROM node:20-alpine AS builder

WORKDIR /app

# Cho phép truyền build-time debug (mặc định rỗng)
ARG BUILD_DEBUG=""
# Nếu BUILD_DEBUG được truyền, export cho các bước tiếp theo (sẽ ảnh hưởng tới RUN npm run build)
ENV DEBUG=${BUILD_DEBUG}

# Copy package.json & package-lock.json
COPY package*.json ./

# Cài tất cả dependencies (bao gồm devDependencies)
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Build Remix app (DEBUG sẽ có hiệu lực trong bước này nếu BUILD_DEBUG được thiết lập)
RUN npm run build

# ===============================
# Stage 2: Production
# ===============================
FROM node:20-alpine AS runtime

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

# Port mặc định
ENV PORT=10000

# Start app (đảm bảo script này tồn tại trong package.json)
CMD ["npm", "run", "docker-start"]
