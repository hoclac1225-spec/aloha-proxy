// lib/shopify.js
import fetch from "node-fetch"; // hoÃƒÂ¡Ã‚ÂºÃ‚Â·c global fetch nÃƒÂ¡Ã‚ÂºÃ‚Â¿u Node 18+

export async function createShopifyCustomer(data) {
  const SHOPIFY_API_TOKEN = process.env.SHOPIFY_API_TOKEN;
  const SHOPIFY_SHOP = process.env.SHOPIFY_SHOP; // vÃƒÆ’Ã‚Â­ dÃƒÂ¡Ã‚Â»Ã‚Â¥: myshop.myshopify.com

  const response = await fetch(`https://${SHOPIFY_SHOP}/admin/api/2025-07/customers.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_API_TOKEN,
    },
    body: JSON.stringify({
      customer: {
        first_name: data.name,
        email: data.email,
        phone: data.phone,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Shopify API error: ${JSON.stringify(err)}`);
  }

  const result = await response.json();
  return result.customer;
}
