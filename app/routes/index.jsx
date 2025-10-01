// app/routes/api/onboard/index.jsx
import { json } from "@remix-run/node";
import { prisma } from "../../db.server"; // relative import -> tránh alias resolution

const MAX_PAYLOAD_SIZE = 1024 * 1024 * 2; // 2MB guard

async function readRequestBody(request) {
  const contentType = (request.headers.get("content-type") || "").toLowerCase();
  if (contentType.includes("application/json")) {
    // safe JSON parse
    try {
      return await request.json();
    } catch (e) {
      throw new Error("INVALID_JSON");
    }
  } else {
    // Try formData -> object
    const form = await request.formData();
    const obj = {};
    for (const [k, v] of form.entries()) obj[k] = v;
    return obj;
  }
}

// POST /api/onboard
export const action = async ({ request }) => {
  try {
    console.log("[api/onboard] incoming request:", {
      method: request.method,
      url: request.url,
      headers: {
        "content-type": request.headers.get("content-type"),
        // other headers if needed
      },
    });

    // Optional: guard content-length (if provided)
    const contentLength = request.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_PAYLOAD_SIZE) {
      console.warn("[api/onboard] Payload too large:", contentLength);
      return json({ ok: false, error: "PAYLOAD_TOO_LARGE" }, { status: 413 });
    }

    const body = await readRequestBody(request);
    console.log("[api/onboard] Received payload:", body);

    // Try to persist if prisma Onboard model exists
    let created = null;
    try {
      if (prisma && prisma.onboard && typeof prisma.onboard.create === "function") {
        // Prisma expects JSON for Json fields; body is object -> good
        created = await prisma.onboard.create({
          data: { payload: body },
        });
        console.log("[api/onboard] Saved to DB:", created);
      } else {
        console.warn("[api/onboard] Prisma model `Onboard` not found. Skipping DB save.");
      }
    } catch (dbErr) {
      // DB-level error (connection/permission/schema)
      console.error("[api/onboard] DB error when creating Onboard:", dbErr);
      // Không expose quá nhiều thông tin production; nhưng cho debug nội bộ thì trả detail
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
    // Distinguish JSON parse error
    if (err.message === "INVALID_JSON") {
      console.warn("[api/onboard] Invalid JSON body");
      return json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
    }

    console.error("[api/onboard] Unexpected error:", err);
    return json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
};

// GET để test nhanh
export const loader = async () => {
  console.log("[api/onboard] loader ping");
  return json({ ok: true, msg: "API /api/onboard is alive" });
};
