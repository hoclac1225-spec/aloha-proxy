# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /app

# copy package.json và package-lock.json
COPY package*.json ./

# dùng npm install thay vì npm ci để tránh fail do lock file
RUN npm install --omit=dev

# copy toàn bộ code và build
COPY . .
RUN npm run build

# --- runner/runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

# thiết lập biến môi trường database
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# copy package.json và package-lock.json
COPY package*.json ./

# cài production dependencies
RUN npm install --omit=dev

# copy build, public và prisma từ builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# copy entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# expose port
EXPOSE 3000

# chạy entrypoint khi container start
ENTRYPOINT ["./entrypoint.sh"]
