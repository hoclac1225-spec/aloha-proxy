# ===============================
# Stage 1: Build
# ===============================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV NODE_ENV=production
RUN npm run build

# ===============================
# Stage 2: Production
# ===============================
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copy built artifacts
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# If you really need remix.config.js at runtime, uncomment the next line and
# ensure remix.config.js is included in the repo and present in builder stage:
# COPY --from=builder /app/remix.config.js ./remix.config.js  # removed: remix.config.js not needed at runtime

ENV PORT=10000
CMD ["npm", "run", "docker-start"]
