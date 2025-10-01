import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"]
});

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

    console.log("[api/onboard] received body:", body);

    // Ghi log ra file (debug dài hạn)
    // import fs from "fs";
    // fs.appendFileSync("onboard.log", JSON.stringify(body) + "\n");

    // Nếu muốn thao tác DB, bỏ comment
    // const created = await prisma.user.create({ data: { name: body.name, email: body.email, password: "temp123" } });
    // console.log("[api/onboard] created user:", created);

    return json({ ok: true, received: body });
  } catch (err) {
    console.error("[api/onboard] Exception:", err);
    return json({ ok: false, error: err.message });
  }
};

export const loader = async () => {
  return json({ message: "POST to /api/onboard" });
};
