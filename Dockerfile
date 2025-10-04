# --- builder stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# copy package.json và package-lock.json
COPY package*.json ./

# cài tất cả dependencies (bao gồm devDependencies)
RUN npm install

# copy toàn bộ code và build
COPY . .
RUN npm run build

# --- runner/runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app

# thiết lập biến môi trường database (tuỳ dự án)
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# copy package.json và package-lock.json
COPY package*.json ./

# cài chỉ production dependencies
RUN npm install --omit=dev

# copy build từ builder
COPY --from=builder /app/build ./build

# copy public và prisma từ builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# copy entrypoint và cấp quyền chạy
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# expose port
EXPOSE 3000

# chạy entrypoint khi container start
ENTRYPOINT ["./entrypoint.sh"]
