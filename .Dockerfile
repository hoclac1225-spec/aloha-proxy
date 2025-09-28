# Chọn Node 20
FROM node:20-alpine

# Cài openssl (Shopify app cần)
RUN apk add --no-cache openssl

# Thư mục làm việc trong container
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Cài dependencies
RUN npm ci --omit=dev

# Copy toàn bộ source code
COPY . .

# Build app (Remix)
RUN npm run build

# Lệnh chạy app
CMD ["npm", "run", "docker-start"]
