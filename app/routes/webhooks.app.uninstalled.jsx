// app/routes/webhooks.app.uninstalled.jsx
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  try {
    const { shop, session, topic } = await authenticate.webhook(request);

    console.log(`? Received ${topic} webhook for ${shop}`);

    // N?u session t?n t?i, xÃƒÂ¯Ã‚Â¿Ã‚Â½a d? li?u liÃƒÂ¯Ã‚Â¿Ã‚Â½n quan shop
    if (session) {
      await db.session.deleteMany({ where: { shop } });
      console.log(`?? Deleted session(s) for shop: ${shop}`);
    }

    return new Response(null, { status: 200 });
  } catch (err) {
    console.error("? /webhooks/app/uninstalled error:", err);
    return new Response("Error processing webhook", { status: 500 });
  }
};

// GET ch? d? test endpoint
export const loader = async () => {
  console.log("?? GET /webhooks/app/uninstalled called");
  return new Response("Webhook endpoint ready", { status: 200 });
};
