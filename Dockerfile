# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- final/runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

# copy package.json then install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# copy build and public from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# copy prisma schema so we can run prisma generate in final image
COPY --from=builder /app/prisma ./prisma

# generate prisma client if schema exists
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; fi

# port and start
EXPOSE 3000
CMD ["npm", "run", "start"]
