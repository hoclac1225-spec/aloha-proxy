// app/routes/api.onboard.jsx
import { json } from "@remix-run/node";
import { prisma } from "~/lib/prisma.server";

/**
 * POST /api/onboard
 * Expect JSON body:
 * {
 *   name?: string,
 *   email: string,
 *   phone?: string,
 *   payload: object
 * }
 */
export const action = async ({ request }) => {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body;

    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      // fallback - try text and parse
      const text = await request.text();
      try {
        body = text ? JSON.parse(text) : {};
      } catch (e) {
        return json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
      }
    }

    if (!body || typeof body !== "object") {
      return json({ ok: false, error: "Invalid request body" }, { status: 400 });
    }

    const { email, name, phone, payload } = body;

    if (!email || typeof email !== "string") {
      return json({ ok: false, error: "Missing required field: email" }, { status: 400 });
    }

    // Ensure payload present (server schema expects payload Json non-null)
    const safePayload = payload ?? {};

    // Create record (model name assumed Onboard)
    // Adjust fields if your prisma model has different column names.
    const created = await prisma.onboard.create({
      data: {
        email,
        name: name ?? null,
        phone: phone ?? null,
        payload: safePayload,
      },
    });

    return json({ ok: true, data: created }, { status: 201 });
  } catch (err) {
    // Prisma errors often include `err.code` or message
    console.error("api.onboard error:", err);

    // If prisma metadata indicates unknown column/field, return clear error to logs
    return json(
      {
        ok: false,
        error: (err && err.message) || String(err),
      },
      { status: 500 }
    );
  }
};

export const loader = async () => {
  // optional: disallow GET on this route
  return json({ ok: false, error: "GET not allowed" }, { status: 405 });
};
