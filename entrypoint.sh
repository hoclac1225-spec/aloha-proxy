#!/bin/sh
# entrypoint.sh

# generate Prisma client
if [ -f prisma/schema.prisma ]; then
  echo "Generating Prisma client..."
  npx prisma generate
  echo "Deploying migrations..."
  npx prisma migrate deploy
fi

# start app
echo "Starting app..."
npm run start
