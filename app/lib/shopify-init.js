// lib/shopify-init.js
import { Shopify } from "@shopify/shopify-api";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStorage } from "@shopify/shopify-api/dist/auth/session";

const prisma = new PrismaClient();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ""),
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new PrismaSessionStorage(prisma),
});

console.log("[shopify-init] Shopify context initialized with PrismaSessionStorage");
