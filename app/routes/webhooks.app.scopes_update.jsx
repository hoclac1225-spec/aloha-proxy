// app/routes/webhooks.app.scopes_update.jsx
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  try {
    const { shop, session, topic } = await authenticate.webhook(request);

    console.log(`? Received ${topic} webhook for ${shop}`);

    // C?p nh?t d? li?u session ho?c quy?n m?i t? shop
    if (session) {
      await db.session.updateMany({
        where: { shop },
        data: { updatedAt: new Date() },
      });
      console.log(`?? Updated session(s) for shop: ${shop}`);
    }

    return new Response(null, { status: 200 });
  } catch (err) {
    console.error("? /webhooks/app/scopes_update error:", err);
    return new Response("Error processing webhook", { status: 500 });
  }
};

// GET ch? d? test endpoint
export const loader = async () => {
  console.log("?? GET /webhooks/app/scopes_update called");
  return new Response("Webhook endpoint ready", { status: 200 });
};
