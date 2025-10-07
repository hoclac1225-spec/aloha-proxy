/**
 * lib/shopify.js
 * Simple Shopify Admin REST create customer using native fetch (Node 18+)
 */
export async function createShopifyCustomer({ name, email, phone }) {
  const shop = process.env.SHOP; // e.g. my-shop.myshopify.com
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  if (!shop) throw new Error("Environment SHOP not set (e.g. my-shop.myshopify.com)");
  if (!token) throw new Error("Environment SHOPIFY_ADMIN_TOKEN not set");

  const [first_name = ""] = (name || "").split(" ");
  const payload = {
    customer: {
      first_name,
      email,
      phone,
    },
  };

  const url = `https://${shop}/admin/api/2024-10/customers.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (!res.ok) throw new Error(`Shopify error ${res.status}: ${JSON.stringify(json)}`);
    return json;
  } catch (err) {
    if (!res.ok) throw new Error(`Shopify error ${res.status}: ${text}`);
    throw err;
  }
}
