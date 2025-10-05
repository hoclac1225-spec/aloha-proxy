#!/bin/sh
set -e

echo "[entrypoint] starting"

# Prisma steps
if [ -n "$SKIP_PRISMA" ] && [ "$SKIP_PRISMA" != "0" ]; then
  echo "[entrypoint] SKIP_PRISMA set; skipping prisma generate/migrate"
else
  if [ -f "./prisma/schema.prisma" ]; then
    echo "[entrypoint] prisma schema detected, running generate..."
    npx prisma generate || echo "[entrypoint] prisma generate failed (continuing)"

    if [ -n "$DATABASE_URL" ] && [ -z "$SKIP_MIGRATIONS" ]; then
      echo "[entrypoint] DATABASE_URL set, running migrate deploy..."
      npx prisma migrate deploy || echo "[entrypoint] migrate deploy failed (continuing)"
    else
      echo "[entrypoint] skipping migrations (DATABASE_URL empty or SKIP_MIGRATIONS set)"
    fi
  else
    echo "[entrypoint] no prisma/schema.prisma found, skipping prisma generate/migrate"
  fi
fi

# ensure PORT
if [ -z "$PORT" ]; then
  PORT=3000
  export PORT
  echo "[entrypoint] PORT not set -> defaulting to $PORT"
else
  echo "[entrypoint] PORT=$PORT"
fi

echo "[entrypoint] starting node app in foreground"
# ensure Node process stays in foreground
exec node build/server.js
