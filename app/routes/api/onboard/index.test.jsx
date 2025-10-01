// app/routes/api/onboard/index.test.jsx
import { json } from "@remix-run/node";
import { prisma } from "../../../db.server"; // từ app/routes/api/onboard -> app/db.server.js (lên 3 cấp)

/**
 * Helper: đọc payload (JSON hoặc form-data)
 */
async function readRequestBody(request) {
  const contentType = (request.headers.get("content-type") || "").toLowerCase();
  if (contentType.includes("application/json")) {
    try {
      return await request.json();
    } catch (e) {
      // JSON không hợp lệ
      const err = new Error("INVALID_JSON");
      err.code = "INVALID_JSON";
      throw err;
    }
  } else {
    // form-data hoặc khác: chuyển FormData -> object
    const form = await request.formData();
    const out = {};
    for (const [k, v] of form.entries()) out[k] = v;
    return out;
  }
}

/**
 * POST /api/onboard
 * - nhận JSON hoặc form-data
 * - log chi tiết
 * - cố lưu vào prisma.onboard nếu tồn tại
 */
export const action = async ({ request }) => {
  try {
    console.log("[api/onboard] incoming request:", {
      method: request.method,
      url: request.url,
      contentType: request.headers.get("content-type"),
      contentLength: request.headers.get("content-length"),
    });

    // Optional: giới hạn kích thước (header-based)
    const contentLength = request.headers.get("content-length");
    if (contentLength && Number(contentLength) > 10 * 1024 * 1024) {
      console.warn("[api/onboard] payload too large:", contentLength);
      return json({ ok: false, error: "PAYLOAD_TOO_LARGE" }, { status: 413 });
    }

    const body = await readRequestBody(request);
    console.log("[api/onboard] parsed body:", body);

    let created = null;
    try {
      if (prisma && prisma.onboard && typeof prisma.onboard.create === "function") {
        // Thực hiện lưu vào DB
        created = await prisma.onboard.create({
          data: { payload: body },
        });
        console.log("[api/onboard] saved to DB:", created);
      } else {
        console.warn("[api/onboard] prisma.onboard model not found, skipping DB write");
      }
    } catch (dbErr) {
      // Log rõ lỗi DB để debug (kết nối, quyền, schema mismatch...)
      console.error("[api/onboard] DB create error:", dbErr);
      return json(
        { ok: false, error: "DB_CREATE_ERROR", detail: dbErr?.message || String(dbErr) },
        { status: 500 }
      );
    }

    return json({ ok: true, received: body, db: created || null }, { status: 200 });
  } catch (err) {
    // Trường hợp lỗi parse JSON
    if (err && err.code === "INVALID_JSON") {
      console.warn("[api/onboard] invalid json payload");
      return json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
    }
    console.error("[api/onboard] unexpected error:", err);
    return json({ ok: false, error: err?.message || "UNKNOWN_ERROR" }, { status: 500 });
  }
};

/**
 * GET /api/onboard (test ping)
 */
export const loader = async () => {
  console.log("[api/onboard] loader ping");
  return json({ ok: true, msg: "API /api/onboard is alive" }, { status: 200 });
};
