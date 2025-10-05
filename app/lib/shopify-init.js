import { Shopify, LATEST_API_VERSION } from "@shopify/shopify-api";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/^https?:\/\//, ""),
  API_VERSION: LATEST_API_VERSION,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.PrismaSessionStorage(prisma),
});

console.log("✅ Shopify context initialized with PrismaSessionStorage");

export { Shopify, prisma };
