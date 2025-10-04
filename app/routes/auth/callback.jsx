import { json } from "@remix-run/node";

/**
 * Dev callback: exchanges code for token and returns token in JSON.
 * Production: store token securely in DB and do not expose it.
 */
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');
  const code = url.searchParams.get('code');
  if (!shop || !code) return new Response('Missing params', { status: 400 });

  const tokenRes = await fetch(https:///admin/oauth/access_token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    }),
  });

  if (!tokenRes.ok) {
    const txt = await tokenRes.text();
    return new Response('Failed to get token: ' + txt, { status: 500 });
  }

  const tokenJson = await tokenRes.json();
  // DEV: return token for inspection. PRODUCTION: save it to DB instead.
  return json({ ok: true, shop, token: tokenJson });
};
