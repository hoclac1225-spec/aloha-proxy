// app/db.server.js
// Export named `prisma` để các file khác (ví dụ: import { prisma } from "~/db.server") hoạt động.
// Dùng globalThis để giữ instance PrismaClient trong môi trường dev (hot reload).
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.__prismaClient ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

// Trong dev, gán lên global để tránh tạo nhiều connection khi hot-reload
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prismaClient = prisma;
}

export { prisma };
