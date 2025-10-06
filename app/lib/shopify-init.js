// lib/shopify-init.mjs
import "../lib/crypto-shim.mjs"; // <--- quan trọng, phải ở trên cùng
import { Shopify } from "@shopify/shopify-api";

export const shopify = new Shopify({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES ? process.env.SCOPES.split(",") : [],
  hostName: process.env.HOST.replace(/^https?:\/\//, ""),
  apiVersion: "2025-07",
  isEmbeddedApp: true,
  sessionStorage: new Shopify.Session.MemorySessionStorage(),
});

export { Shopify };
