#!/bin/sh
set -e

# optional: export runtime env from ARG or keep Render env
# ensure prisma client is generated (if needed)
if [ -f "./node_modules/.prisma/client/index.js" ]; then
  echo "Prisma client exists"
else
  echo "Generating prisma client"
  npx prisma generate
fi

# run migrations if env indicates
if [ -n "$DATABASE_URL" ]; then
  echo "Running prisma migrate deploy (if any)"
  npx prisma migrate deploy || true
fi

# finally start the app - ensure it uses process.env.PORT
exec npm start
