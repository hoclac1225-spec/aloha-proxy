# --- Stage 1: Builder ---
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # Copy package.json & package-lock.json
    COPY package.json package-lock.json* ./
    
    # Cài cả devDependencies để build
    RUN npm ci
    
    # Copy toàn bộ code
    COPY . .
    
    # Build project
    RUN npm run build
    
    # --- Stage 2: Production ---
    FROM node:20-alpine
    WORKDIR /app
    
    # Copy kết quả build từ stage trước
    COPY --from=builder /app/build ./build
    
    # Copy package.json & package-lock.json
    COPY package.json package-lock.json* ./
    
    # Chỉ cài dependencies runtime (không cài devDependencies)
    RUN npm ci --omit=dev
    
    # Chạy ứng dụng
    CMD ["node", "build/index.js"]
    