// app/routes/api.onboard.jsx
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function action({ request }) {
  try {
    // Try parse JSON body first
    let data;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        data = await request.json();
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: "Invalid JSON payload" }), { status: 400 });
      }
    } else {
      // fallback: try formData (multipart/form-data or urlencoded)
      const form = await request.formData();
      data = {};
      for (const [k, v] of form.entries()) {
        if (k === "payload") {
          // payload might be JSON string — attempt parse
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

    // Ensure payload exists (Prisma Json column expects a value)
    if (data.payload == null) {
      data.payload = {};
    }

    // Basic validation (adjust as needed)
    if (!data.name || !data.email) {
      return new Response(JSON.stringify({ ok: false, error: "Missing required fields: name or email" }), { status: 400 });
    }

    // Create record — adapt model name and fields to your prisma schema
    const created = await prisma.onboard.create({
      data: {
        name: String(data.name),
        email: String(data.email),
        phone: String(data.phone || ""),
        payload: data.payload, // prisma Json
      },
    });

    return new Response(JSON.stringify({ ok: true, data: created }), { status: 200 });
  } catch (err) {
    console.error("api.onboard server error:", err);
    // Do NOT leak internals in production; safe message here
    const message = err && err.message ? err.message : "Server error";
    return new Response(JSON.stringify({ ok: false, error: message }), { status: 500 });
  } finally {
    // optional: avoid too many clients in serverless environment
    // await prisma.$disconnect(); // only if you're creating/disposing frequently
  }
}
