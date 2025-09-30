#!/bin/sh
# Chạy migration trước khi start app
if [ -f prisma/schema.prisma ]; then
  echo "Running Prisma migrations..."
  npx prisma migrate deploy
fi

# Start app
echo "Starting app..."
npm run start
