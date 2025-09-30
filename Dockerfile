# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /app

# copy package files và cài dependencies
COPY package*.json ./
RUN npm ci

# copy toàn bộ source code
COPY . .
RUN npm run build

# --- final/runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

# copy package.json và cài production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# copy build và public từ builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# copy prisma schema và scripts từ builder
COPY --from=builder /app/prisma ./prisma

# generate prisma client nếu schema tồn tại
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; fi

# chạy migration trước khi start app
RUN if [ -f prisma/schema.prisma ]; then npx prisma migrate deploy; fi

# port và start
EXPOSE 3000
CMD ["npm", "run", "start"]
