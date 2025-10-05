#!/bin/sh
set -e

echo "[entrypoint] starting"

# Optionally skip prisma steps
if [ -n "$SKIP_PRISMA" ] && [ "$SKIP_PRISMA" != "0" ]; then
  echo "[entrypoint] SKIP_PRISMA set; skipping prisma generate/migrate"
else
  if [ -f "./prisma/schema.prisma" ]; then
    echo "[entrypoint] prisma schema detected, running generate..."
    # generate client (safe if already exists)
    npx prisma generate || {
      echo "[entrypoint] prisma generate failed (continuing)"; 
    }

    if [ -n "$DATABASE_URL" ] && [ -z "$SKIP_MIGRATIONS" ]; then
      echo "[entrypoint] DATABASE_URL set, attempting prisma migrate deploy..."
      # run migrations (best-effort; do not fail the container permanently if migrations fail)
      npx prisma migrate deploy || {
        echo "[entrypoint] prisma migrate deploy failed (continuing). If you want to fail on migration error, unset SKIP_PRISMA and SKIP_MIGRATIONS."
      }
    else
      echo "[entrypoint] skipping migrations (DATABASE_URL empty or SKIP_MIGRATIONS set)"
    fi
  else
    echo "[entrypoint] no prisma/schema.prisma found, skipping prisma generate/migrate"
  fi
fi

# ensure PORT is set for compatibility
if [ -z "$PORT" ]; then
  PORT=3000
  export PORT
  echo "[entrypoint] PORT not set -> defaulting to $PORT"
else
  echo "[entrypoint] PORT=$PORT"
fi

echo "[entrypoint] starting node app (npm start)"
# exec to replace shell with node process so signals are handled properly
exec npm start
