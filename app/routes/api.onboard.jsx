// app/routes/api.onboard.jsx
import { json } from "@remix-run/node";

/**
 * POST /api/onboard
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

    // debug: log to server console (Remix server)
    console.log("/api/onboard received:", body);

    return json({ ok: true, received: body }, { status: 200 });
  } catch (err) {
    console.error("api.onboard error:", err);
    return json({ ok: false, error: err.message }, { status: 500 });
  }
};

export const loader = async () => {
  return json({ message: "POST to /api/onboard" });
};
