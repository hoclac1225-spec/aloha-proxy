// app/test-db.js
import prisma from "./db.server.js";

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT 1+1 as result`;
    console.log("Database connection OK:", result);
  } catch (err) {
    console.error("Database connection ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
