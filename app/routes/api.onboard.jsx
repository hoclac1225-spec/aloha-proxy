// app/routes/api.onboard.jsx
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function action({ request }) {
  try {
    let data;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        data = await request.json();
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: "Invalid JSON payload" }), { status: 400 });
      }
    } else {
      // support form submissions (multipart/form-data or urlencoded)
      const form = await request.formData();
      data = {};
      for (const [k, v] of form.entries()) {
        if (k === "payload") {
          try {
            data.payload = typeof v === "string" ? JSON.parse(v) : v;
          } catch (e) {
            data.payload = v;
          }
        } else {
          data[k] = v;
        }
      }
    }

    // Ensure payload exists for Prisma Json field
    if (data.payload == null) data.payload = {};

    // Basic required fields
    if (!data.name || !data.email) {
      return new Response(JSON.stringify({ ok: false, error: "Missing required fields: name or email" }), { status: 400 });
    }

    // Create record in DB — adapt fields to your prisma schema if different
    const created = await prisma.onboard.create({
      data: {
        name: String(data.name),
        email: String(data.email),
        phone: String(data.phone || ""),
        payload: data.payload,
      },
    });

    return new Response(JSON.stringify({ ok: true, data: created }), { status: 200 });
  } catch (err) {
    console.error("api.onboard server error:", err);
    const message = err && err.message ? err.message : "Server error";
    // In production avoid exposing raw DB errors — consider sanitizing
    return new Response(JSON.stringify({ ok: false, error: message }), { status: 500 });
  }
}
