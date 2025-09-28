import db from "../db.server";       // thêm dòng này
import { json } from "@remix-run/node";

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

    // Ví dụ lưu vào Prisma (bạn cần có model Onboard trong schema.prisma)
    // await db.onboard.create({ data: { payload: JSON.stringify(body) } });

    console.log("/api/onboard received:", body);
    return json({ ok: true, received: body }, { status: 200 });
  } catch (err) {
    console.error("api.onboard error:", err);
    return json({ ok: false, error: err.message }, { status: 500 });
  }
};
