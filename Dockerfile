# --- builder stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# cài build tools cho module native
RUN apk add --no-cache python3 make g++

# copy package.json và package-lock.json
COPY package*.json ./

# cài tất cả dependencies (bao gồm devDependencies)
RUN npm install

# copy code và build
COPY . .
RUN npm run build

# --- runner stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# chỉ cài production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# copy build, public, prisma từ builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# copy entrypoint và cấp quyền
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
