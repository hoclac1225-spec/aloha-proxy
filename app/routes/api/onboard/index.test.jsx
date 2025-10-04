// app/routes/api/onboard/index.test.jsx
import { json } from "@remix-run/node";
import { prisma } from "../../../db.server"; // tÃƒÂ¡Ã‚Â»Ã‚Â« app/routes/api/onboard -> app/db.server.js (lÃƒÆ’Ã‚Âªn 3 cÃƒÂ¡Ã‚ÂºÃ‚Â¥p)

/**
 * Helper: Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Âc payload (JSON hoÃƒÂ¡Ã‚ÂºÃ‚Â·c form-data)
 */
async function readRequestBody(request) {
  const contentType = (request.headers.get("content-type") || "").toLowerCase();
  if (contentType.includes("application/json")) {
    try {
      return await request.json();
    } catch (e) {
      // JSON khÃƒÆ’Ã‚Â´ng hÃƒÂ¡Ã‚Â»Ã‚Â£p lÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡
      const err = new Error("INVALID_JSON");
      err.code = "INVALID_JSON";
      throw err;
    }
  } else {
    // form-data hoÃƒÂ¡Ã‚ÂºÃ‚Â·c khÃƒÆ’Ã‚Â¡c: chuyÃƒÂ¡Ã‚Â»Ã†â€™n FormData -> object
    const form = await request.formData();
    const out = {};
    for (const [k, v] of form.entries()) out[k] = v;
    return out;
  }
}

/**
 * POST /api/onboard
 * - nhÃƒÂ¡Ã‚ÂºÃ‚Â­n JSON hoÃƒÂ¡Ã‚ÂºÃ‚Â·c form-data
 * - log chi tiÃƒÂ¡Ã‚ÂºÃ‚Â¿t
 * - cÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœ lÃƒâ€ Ã‚Â°u vÃƒÆ’Ã‚Â o prisma.onboard nÃƒÂ¡Ã‚ÂºÃ‚Â¿u tÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“n tÃƒÂ¡Ã‚ÂºÃ‚Â¡i
 */
export const action = async ({ request }) => {
  try {
    console.log("[api/onboard] incoming request:", {
      method: request.method,
      url: request.url,
      contentType: request.headers.get("content-type"),
      contentLength: request.headers.get("content-length"),
    });

    // Optional: giÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi hÃƒÂ¡Ã‚ÂºÃ‚Â¡n kÃƒÆ’Ã‚Â­ch thÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºc (header-based)
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
        // ThÃƒÂ¡Ã‚Â»Ã‚Â±c hiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n lÃƒâ€ Ã‚Â°u vÃƒÆ’Ã‚Â o DB
        created = await prisma.onboard.create({
          data: { payload: body },
        });
        console.log("[api/onboard] saved to DB:", created);
      } else {
        console.warn("[api/onboard] prisma.onboard model not found, skipping DB write");
      }
    } catch (dbErr) {
      // Log rÃƒÆ’Ã‚Âµ lÃƒÂ¡Ã‚Â»Ã¢â‚¬â€i DB Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ debug (kÃƒÂ¡Ã‚ÂºÃ‚Â¿t nÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœi, quyÃƒÂ¡Ã‚Â»Ã‚Ân, schema mismatch...)
      console.error("[api/onboard] DB create error:", dbErr);
      return json(
        { ok: false, error: "DB_CREATE_ERROR", detail: dbErr?.message || String(dbErr) },
        { status: 500 }
      );
    }

    return json({ ok: true, received: body, db: created || null }, { status: 200 });
  } catch (err) {
    // TrÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Âng hÃƒÂ¡Ã‚Â»Ã‚Â£p lÃƒÂ¡Ã‚Â»Ã¢â‚¬â€i parse JSON
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
