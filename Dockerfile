# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /app

# copy package.json và cài dev deps
COPY package*.json ./
RUN npm ci

# copy toàn bộ code và build
COPY . .
RUN npm run build

# --- final/runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

# Thiết lập biến môi trường DATABASE_URL để chạy migration lúc build
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# copy package.json và cài production deps
COPY package*.json ./
RUN npm ci --omit=dev

# copy build và public từ builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# copy prisma schema để chạy migration
COPY --from=builder /app/prisma ./prisma

# chạy migration ngay lúc build
RUN if [ -f prisma/schema.prisma ]; then npx prisma migrate deploy; fi

# port và start app
EXPOSE 3000
CMD ["npm", "run", "start"]
