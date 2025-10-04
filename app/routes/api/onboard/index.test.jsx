// app/routes/api/onboard/index.test.jsx
import { json } from "@remix-run/node";
import { prisma } from "../../../db.server"; // tá»« app/routes/api/onboard -> app/db.server.js (lÃªn 3 cáº¥p)

/**
 * Helper: Ä‘á»c payload (JSON hoáº·c form-data)
 */
async function readRequestBody(request) {
  const contentType = (request.headers.get("content-type") || "").toLowerCase();
  if (contentType.includes("application/json")) {
    try {
      return await request.json();
    } catch (e) {
      // JSON khÃ´ng há»£p lá»‡
      const err = new Error("INVALID_JSON");
      err.code = "INVALID_JSON";
      throw err;
    }
  } else {
    // form-data hoáº·c khÃ¡c: chuyá»ƒn FormData -> object
    const form = await request.formData();
    const out = {};
    for (const [k, v] of form.entries()) out[k] = v;
    return out;
  }
}

/**
 * POST /api/onboard
 * - nháº­n JSON hoáº·c form-data
 * - log chi tiáº¿t
 * - cá»‘ lÆ°u vÃ o prisma.onboard náº¿u tá»“n táº¡i
 */
export const action = async ({ request }) => {
  try {
    console.log("[api/onboard] incoming request:", {
      method: request.method,
      url: request.url,
      contentType: request.headers.get("content-type"),
      contentLength: request.headers.get("content-length"),
    });

    // Optional: giá»›i háº¡n kÃ­ch thÆ°á»›c (header-based)
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
        // Thá»±c hiá»‡n lÆ°u vÃ o DB
        created = await prisma.onboard.create({
          data: { payload: body },
        });
        console.log("[api/onboard] saved to DB:", created);
      } else {
        console.warn("[api/onboard] prisma.onboard model not found, skipping DB write");
      }
    } catch (dbErr) {
      // Log rÃµ lá»—i DB Ä‘á»ƒ debug (káº¿t ná»‘i, quyá»n, schema mismatch...)
      console.error("[api/onboard] DB create error:", dbErr);
      return json(
        { ok: false, error: "DB_CREATE_ERROR", detail: dbErr?.message || String(dbErr) },
        { status: 500 }
      );
    }

    return json({ ok: true, received: body, db: created || null }, { status: 200 });
  } catch (err) {
    // TrÆ°á»ng há»£p lá»—i parse JSON
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
