// app/routes/api/onboard.js  (Remix action example)
import { json } from "@remix-run/node";
import { prisma } from "~/db.server"; // hoáº·c Ä‘Ãºng Ä‘Æ°á»ng import prisma trong project

export const action = async ({ request }) => {
  try {
    // Try to parse formData
    let form = null;
    try {
      form = await request.formData();
    } catch (e) {
      form = null;
    }

    // Logging header + body for debugging (lightweight)
    try {
      const hdrs = {};
      for (const [k, v] of request.headers.entries()) hdrs[k] = v;
      console.info("[api/onboard] headers:", hdrs);
    } catch (e) {}

    let name = null, email = null, phone = "", payload = null;

    if (form) {
      // collect fields from formData
      name = form.get("name") ?? null;
      email = form.get("email") ?? null;
      phone = form.get("phone") ?? "";
      payload = form.get("payload") ?? null;

      // If payload is a File with JSON content, read it
      if (payload && typeof payload !== "string" && payload instanceof File) {
        try {
          const text = await payload.text();
          payload = JSON.parse(text);
        } catch (e) {
          // keep as text
          payload = null;
        }
      }

      // If payload is a string that looks like JSON, parse it
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch (e) {
          // leave as string (or set to {})
          payload = {};
        }
      }
    } else {
      // fallback to JSON body
      try {
        const jsonBody = await request.json();
        name = jsonBody.name ?? null;
        email = jsonBody.email ?? null;
        phone = jsonBody.phone ?? "";
        payload = jsonBody.payload ?? null;
      } catch (e) {
        // no body
      }
    }

    // DEBUG: log what we extracted
    console.info("[api/onboard] parsed:", { name, email, phone, payloadExists: payload !== null });

    // Ensure payload exists for Prisma (avoid missing required field)
    if (payload === null || payload === undefined) {
      payload = {};
    }

    // Basic validation
    if (!name || !email) {
      return json({ ok: false, error: "Missing name or email" }, { status: 400 });
    }

    // Create in DB
    const created = await prisma.onboard.create({
      data: {
        name,
        email,
        phone,
        payload, // payload is JSON (object)
      },
    });

    return json({ ok: true, data: created });
  } catch (err) {
    console.error("[api/onboard] error:", err && (err.stack || err.message || err));
    return json({ ok: false, error: (err && err.message) || "Internal server error" }, { status: 500 });
  }
};
