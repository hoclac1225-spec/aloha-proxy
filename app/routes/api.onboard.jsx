// app/routes/api.onboard.jsx
// Remix action handler for POST /api/onboard
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function action({ request }) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let data = {};

    if (contentType.includes("application/json")) {
      try {
        data = await request.json();
      } catch (e) {
        return jsonResponse({ ok: false, error: "Invalid JSON payload" }, 400);
      }
    } else {
      // form-data or urlencoded fallback
      try {
        const form = await request.formData();
        for (const [k, v] of form.entries()) {
          if (k === "payload") {
            if (typeof v === "string") {
              try {
                data.payload = JSON.parse(v);
              } catch (e) {
                // keep string if parse fails
                data.payload = v;
              }
            } else {
              data.payload = v;
            }
          } else {
            data[k] = v;
          }
        }
      } catch (e) {
        // unable to parse formData
        return jsonResponse({ ok: false, error: "Unable to parse form data" }, 400);
      }
    }

    // Ensure required fields present
    if (!data.name || !data.email) {
      return jsonResponse({ ok: false, error: "Missing required fields: name or email" }, 400);
    }

    // Ensure payload property exists and is JSON-compatible
    let payloadValue = data.payload;
    if (payloadValue == null) {
      payloadValue = {};
    } else {
      // if payload is a string that looks like JSON, try to parse
      if (typeof payloadValue === "string") {
        try {
          payloadValue = JSON.parse(payloadValue);
        } catch (e) {
          // leave as string - Prisma JSON field will reject non-object if schema expects object,
          // but we keep it to give helpful error
        }
      }
    }

    // Build createData explicitly so `payload` property is always present
    const createData = {
      name: String(data.name),
      email: String(data.email),
      phone: String(data.phone || ""),
      payload: payloadValue,
    };

    // Try to create; catch known Prisma errors and return sanitized messages
    let created;
    try {
      created = await prisma.onboard.create({ data: createData });
    } catch (dbErr) {
      console.error("Prisma create error:", String(dbErr));
      // If migration/schema mismatch or missing column, return helpful message
      const msg = dbErr && dbErr.message ? dbErr.message : "Database error";
      return jsonResponse({ ok: false, error: `DB error: ${msg}` }, 500);
    }

    return jsonResponse({ ok: true, data: created }, 200);
  } catch (err) {
    console.error("api.onboard unexpected error:", err);
    return jsonResponse({ ok: false, error: "Server error" }, 500);
  }
}

/* small helper to create JSON responses without importing Remix helpers here */
function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
