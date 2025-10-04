// app/db.server.js
// Export named `prisma` Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ cÃƒÆ’Ã‚Â¡c file khÃƒÆ’Ã‚Â¡c (vÃƒÆ’Ã‚Â­ dÃƒÂ¡Ã‚Â»Ã‚Â¥: import { prisma } from "~/db.server") hoÃƒÂ¡Ã‚ÂºÃ‚Â¡t Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ng.
// DÃƒÆ’Ã‚Â¹ng globalThis Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ giÃƒÂ¡Ã‚Â»Ã‚Â¯ instance PrismaClient trong mÃƒÆ’Ã‚Â´i trÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Âng dev (hot reload).
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

// Trong dev, gÃƒÆ’Ã‚Â¡n lÃƒÆ’Ã‚Âªn global Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ trÃƒÆ’Ã‚Â¡nh tÃƒÂ¡Ã‚ÂºÃ‚Â¡o nhiÃƒÂ¡Ã‚Â»Ã‚Âu connection khi hot-reload
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prismaClient = prisma;
}

export { prisma };
export default prisma; // thÃƒÆ’Ã‚Âªm default export Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ tÃƒâ€ Ã‚Â°Ãƒâ€ Ã‚Â¡ng thÃƒÆ’Ã‚Â­ch vÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi cÃƒÂ¡Ã‚ÂºÃ‚Â£ 2 kiÃƒÂ¡Ã‚Â»Ã†â€™u import
