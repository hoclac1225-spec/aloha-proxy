// lib/shopify-init.mjs
import { Shopify } from "@shopify/shopify-api";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";

const prisma = new PrismaClient();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY || "",
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET || "",
  SCOPES: (process.env.SCOPES || "write_products,read_customers").split(","),
  HOST_NAME: (process.env.HOST || "localhost:3000").replace(/^https?:\/\//, ""),
  IS_EMBEDDED_APP: true,
  API_VERSION: process.env.SHOPIFY_API_VERSION || "2024-10",
  SESSION_STORAGE: new PrismaSessionStorage(prisma),
});

console.log("[shopify-init] Shopify.Context initialized with PrismaSessionStorage");

export { prisma, Shopify };
