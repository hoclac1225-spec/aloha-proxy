// app/routes/api/onboard/index.jsx
import { json } from "@remix-run/node";
import { prisma } from "../../db.server"; // relative import -> tránh lỗi alias resolution

// POST /api/onboard
export const action = async ({ request }) => {
  try {
    // Hỗ trợ JSON hoặc form-data
    const contentType = request.headers.get("content-type") || "";
    let body;
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      // FormData hoặc others: chuyển thành object
      const form = await request.formData();
      body = {};
      for (const [k, v] of form.entries()) body[k] = v;
    }

    console.log("[api/onboard] Received payload:", body);

    // Thử lưu nếu model Onboard tồn tại
    let created = null;
    try {
      if (prisma && prisma.onboard && typeof prisma.onboard.create === "function") {
        created = await prisma.onboard.create({
          data: { payload: body },
        });
        console.log("[api/onboard] Saved to DB:", created);
      } else {
        console.warn(
          "[api/onboard] Prisma model `Onboard` not found. Skipping DB save."
        );
      }
    } catch (dbErr) {
      // Bắt lỗi DB riêng để biết rõ nguyên nhân (kết nối, quyền, v.v.)
      console.error("[api/onboard] DB error when creating onboard:", dbErr);
      // Trả về vẫn kèm lỗi DB để client debug (tuỳ bạn muốn expose message hay không)
      return json(
        {
          ok: false,
          error: "DB_ERROR",
          detail: dbErr?.message || String(dbErr),
        },
        { status: 500 }
      );
    }

    return json({
      ok: true,
      received: body,
      db: created || null,
    });
  } catch (err) {
    console.error("[api/onboard] Unexpected error:", err);
    return json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
};

// GET để test nhanh (optional)
export const loader = async () => {
  return json({ ok: true, msg: "API /api/onboard is alive" });
};
