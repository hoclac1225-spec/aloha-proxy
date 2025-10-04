import prismaPkg from "@prisma/client";
const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.onboard.findMany();
  console.log(rows);
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
