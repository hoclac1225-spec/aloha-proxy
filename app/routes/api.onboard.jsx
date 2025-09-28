// app/routes/api.onboard.jsx
import db from "../db.server";
import { json } from "@remix-run/node";

/**
 * POST /api/onboard
 * Expect JSON body with { name, email, phone }
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

    const { name, email, phone } = body;
    if (!name || !email) {
      return json({ ok: false, error: "name and email are required" }, { status: 400 });
    }

    const created = await db.onboard.create({
      data: {
        name: String(name),
        email: String(email),
        phone: phone ? String(phone) : "",
      },
    });

    console.log("/api/onboard saved:", created);
    return json({ ok: true, received: body, created }, { status: 200 });
  } catch (err) {
    console.error("api.onboard error:", err);
    return json({ ok: false, error: err.message }, { status: 500 });
  }
};

export const loader = async () => {
  return json({ message: "POST to /api/onboard" });
};
