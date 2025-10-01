import { json } from "@remix-run/node";
import { prisma } from "~/db.server";

// POST /api/onboard
export const action = async ({ request }) => {
  try {
    const body = await request.json();

    console.log("Received onboard payload:", body);

    // Lưu vào DB
    let created;
    if (prisma.onboard) {
      created = await prisma.onboard.create({
        data: { payload: body },
      });
      console.log("Saved to DB:", created);
    } else {
      console.warn("Prisma onboard model not found, skipping DB save.");
    }

    return json({
      ok: true,
      received: body,
      db: created || null,
    });
  } catch (err) {
    console.error("Onboard error:", err);
    return json({ ok: false, error: err.message });
  }
};

// Cho phép GET test nhanh (không bắt buộc)
export const loader = async () => {
  return json({ ok: true, msg: "API /api/onboard is alive" });
};
