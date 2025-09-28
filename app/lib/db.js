// lib/db.js
import prisma from "./prisma.js";

export async function saveOnboardingData(data) {
  // Kiểm tra email đã tồn tại chưa
  const exists = await prisma.onboard.findUnique({ where: { email: data.email } });
  if (exists) {
    throw new Error("Email already exists");
  }

  // Lưu dữ liệu vào DB
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
