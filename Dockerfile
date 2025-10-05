FROM node:20-alpine AS runner
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# copy package.json & node_modules
COPY package*.json ./ 
COPY --from=builder /app/node_modules ./node_modules

# copy build & runtime assets
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
