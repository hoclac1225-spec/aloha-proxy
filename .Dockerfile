# --- builder stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source code
COPY . .

# Build the Remix app
RUN npm run build

# --- final/runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app

# Copy package files and install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files and public assets from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# Copy prisma schema & generated client
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client if schema exists
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; fi

# Expose the port Remix will run on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
