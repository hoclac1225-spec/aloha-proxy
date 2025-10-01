-- Initial migration for User and Session tables
-- Tương thích với schema Prisma hiện tại
-- Cải tiến: đặt default timestamp, index cho expiresAt

CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Session" (
    "id" SERIAL PRIMARY KEY,
    "sessionId" TEXT UNIQUE NOT NULL,
    "userId" INT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "data" JSON NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index cải thiện tốc độ query theo expiresAt
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");
