// app/routes/api/onboard/index.test.jsx
import { json } from "@remix-run/node";
import { prisma } from "../../../db.server"; // relative import an toàn

/**
 * POST /api/onboard/test
 * Nhận payload từ client (JSON hoặc FormData), log ra, và lưu vào DB nếu model Onboard có.
 */
export const action = async ({ request }) => {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body;

    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const form = await request.formData();
      body = {};
      for (const [k, v] of form.entries()) body[k] = v;
    }

    console.log("[onboard.test] Received payload:", body);

    let created = null;
    try {
      if (prisma?.onboard?.create) {
        created = await prisma.onboard.create({
          data: { payload: body },
        });
        console.log("[onboard.test] Saved to DB:", created);
      } else {
        console.warn(
          "[onboard.test] ⚠️ Prisma model Onboard không tồn tại. Bỏ qua lưu DB."
        );
      }
    } catch (dbErr) {
      console.error("[onboard.test] ❌ Lỗi DB khi create Onboard:", dbErr);
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
      db: created,
    });
  } catch (err) {
    console.error("[onboard.test] ❌ Lỗi không mong đợi:", err);
    return json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
};

/**
 * GET /api/onboard/test
 * Cho phép kiểm tra API đang sống
 */
export const loader = async () => {
  console.log("[onboard.test] GET loader called");
  return json({ ok: true, msg: "API /api/onboard/test is alive" });
};
