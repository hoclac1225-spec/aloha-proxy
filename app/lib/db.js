// lib/db.js
import prisma from "./prisma.js";

export async function saveOnboardingData(data) {
  // KiÃƒÂ¡Ã‚Â»Ã†â€™m tra email Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â£ tÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“n tÃƒÂ¡Ã‚ÂºÃ‚Â¡i chÃƒâ€ Ã‚Â°a
  const exists = await prisma.onboard.findUnique({ where: { email: data.email } });
  if (exists) {
    throw new Error("Email already exists");
  }

  // LÃƒâ€ Ã‚Â°u dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u vÃƒÆ’Ã‚Â o DB
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
