// app/routes/api.onboard.jsx
import { json } from "@remix-run/node";
import prisma from "~/lib/prisma.server"; // adjust path if your prisma client import differs

export const action = async ({ request }) => {
  try {
    const data = await request.json().catch(() => null);

    if (!data) {
      return json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
    }

    // Accept either top-level payload or whole body
    const payload = data.payload ?? data;

    if (!payload || typeof payload !== "object") {
      return json(
        { ok: false, error: "Missing or invalid 'payload' object" },
        { status: 400 }
      );
    }

    // Defensive: build createData only with the fields the DB likely accepts.
    // We'll save the whole payload into the `payload` JSON column (if it exists).
    // Try to create minimal record keyed by payload.
    try {
      const created = await prisma.onboard.create({
        data: {
          // If your model uses different column names, this will fail.
          // We assume there is a Json column named `payload`.
          payload,
        },
      });
      return json({ ok: true, data: created }, { status: 201 });
    } catch (prismaErr) {
      // If prisma error complaining about unknown argument, attempt alternative:
      const msg = String(prismaErr?.message ?? prismaErr);
      if (msg.includes("Unknown argument")) {
        // Fallback: try to write into a generic `data` table/column or return informative error
        return json(
          {
            ok: false,
            error:
              "DB schema mismatch: server expected a JSON column named `payload`. " +
              "Please check prisma/schema.prisma and available columns. Prisma error: " +
              msg,
          },
          { status: 500 }
        );
      }
      // default prisma error return
      return json({ ok: false, error: "DB error: " + msg }, { status: 500 });
    }
  } catch (err) {
    console.error("api.onboard error:", err);
    return json({ ok: false, error: String(err) }, { status: 500 });
  }
};

export const loader = async () => {
  return json({ ok: true, message: "POST to this route to onboard" });
};
