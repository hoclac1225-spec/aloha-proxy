// scripts/peekOnboard.cjs
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.onboard.findMany();
  console.log(rows);
  await prisma.$disconnect();
}
main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
