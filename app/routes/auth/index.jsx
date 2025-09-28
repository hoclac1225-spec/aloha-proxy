import { redirect } from "@remix-run/node";

/**
 * Minimal scopes for testing. Edit and add scopes + tick them in Partner Dashboard when ready.
 */
const SCOPES = "read_products,write_products";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  if (!shop) throw new Response("Missing shop", { status: 400 });

  const state = Math.random().toString(36).substring(2, 12); // production: save in session
  const params = new URLSearchParams({
    client_id: process.env.SHOPIFY_API_KEY,
    scope: SCOPES,
    redirect_uri: `${process.env.SHOPIFY_APP_URL}/auth/callback`,
    state,
  });

  return redirect(`https://${shop}/admin/oauth/authorize?${params.toString()}`);
};