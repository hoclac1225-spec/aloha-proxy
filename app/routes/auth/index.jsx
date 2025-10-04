// app/routes/auth/index.jsx
import { redirect } from "@remix-run/node";

/**
 * Minimal scopes for testing. Edit and add scopes when ready.
 */
const SCOPES = ["read_products", "write_products"].join(",");

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  if (!shop) {
    console.warn("[auth] Missing shop param");
    throw new Response("Missing shop", { status: 400 });
  }

  // KiÃƒÂ¡Ã‚Â»Ã†â€™m tra biÃƒÂ¡Ã‚ÂºÃ‚Â¿n mÃƒÆ’Ã‚Â´i trÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Âng
  const clientId = process.env.SHOPIFY_API_KEY;
  const appUrl = process.env.SHOPIFY_APP_URL;
  if (!clientId || !appUrl) {
    console.error("[auth] Missing SHOPIFY_API_KEY or SHOPIFY_APP_URL env vars");
    throw new Response("Server misconfigured", { status: 500 });
  }

  // state minimal (production: lÃƒâ€ Ã‚Â°u vÃƒÆ’Ã‚Â o session)
  const state = Math.random().toString(36).substring(2, 12);
  const params = new URLSearchParams({
    client_id: clientId,
    scope: SCOPES,
    redirect_uri: `${appUrl.replace(/\/+$/, "")}/auth/callback`,
    state,
  });

  const redirectUrl = `https://${encodeURIComponent(shop)}/admin/oauth/authorize?${params.toString()}`;
  console.log("[auth] Redirecting to:", redirectUrl);
  return redirect(redirectUrl);
};
