#!/bin/sh
set -e

echo "[entrypoint] starting container"

# --- Prisma generate & migrate ---
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

# --- PORT ---
if [ -z "$PORT" ]; then
  PORT=3000
  export PORT
  echo "[entrypoint] PORT not set, defaulting to $PORT"
else
  echo "[entrypoint] PORT=$PORT"
fi

echo "[entrypoint] starting Node app in foreground..."
# start app in foreground so container stays alive
exec npm run start
