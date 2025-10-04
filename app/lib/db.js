// lib/db.js
import prisma from "./prisma.js";

export async function saveOnboardingData(data) {
  // Kiá»ƒm tra email Ä‘Ã£ tá»“n táº¡i chÆ°a
  const exists = await prisma.onboard.findUnique({ where: { email: data.email } });
  if (exists) {
    throw new Error("Email already exists");
  }

  // LÆ°u dá»¯ liá»‡u vÃ o DB
  const record = await prisma.onboard.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      createdAt: new Date(),
    },
  });

  return record;
}
