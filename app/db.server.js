// app/db.server.js
// Export named `prisma` Ä‘á»ƒ cÃ¡c file khÃ¡c (vÃ­ dá»¥: import { prisma } from "~/db.server") hoáº¡t Ä‘á»™ng.
// DÃ¹ng globalThis Ä‘á»ƒ giá»¯ instance PrismaClient trong mÃ´i trÆ°á»ng dev (hot reload).
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

// Trong dev, gÃ¡n lÃªn global Ä‘á»ƒ trÃ¡nh táº¡o nhiá»u connection khi hot-reload
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prismaClient = prisma;
}

export { prisma };
export default prisma; // thÃªm default export Ä‘á»ƒ tÆ°Æ¡ng thÃ­ch vá»›i cáº£ 2 kiá»ƒu import
