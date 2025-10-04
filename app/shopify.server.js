// app/shopify.server.js
import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";

import prisma from "./db.server"; // giả sử file này export default PrismaClient instance

// Try to require PrismaSessionStorage but be resilient: nếu Prisma client chưa có model Session
// hoặc constructor ném lỗi, chúng ta fallback sang memory storage (development only).
let sessionStorageInstance;

async function createSessionStorage() {
  // 1) try to use Prisma storage if possible
  try {
    // dynamic import để tránh lỗi loading module trước khi prisma sẵn sàng
    const { PrismaSessionStorage } = await import("@shopify/shopify-app-session-storage-prisma");

    // If prisma.client does not include `session` property, the PrismaSessionStorage
    // constructor will probably throw; we do a lightweight guard:
    if (typeof prisma.session === "undefined") {
      // prisma client does not have generated `session` model — bail to fallback
      throw new Error("prisma.session is undefined");
    }

    // instantiate storage (this may still throw if schema mismatch)
    const storage = new PrismaSessionStorage(prisma);
    console.log("[shopify.server] Using PrismaSessionStorage");
    return storage;
  } catch (err) {
    // fallback to simple memory storage — useful for local dev when DB schema not ready
    console.warn(
      "[shopify.server] PrismaSessionStorage unavailable or prisma.session missing — falling back to in-memory session storage (dev only).",
      err && (err.message || err.toString())
    );

    // Minimal in-memory session storage implementing required methods:
    class MemorySessionStorage {
      constructor() {
        // key: session.id -> session object
        this.map = new Map();
      }
      // storeSession(session) -> session
      async storeSession(session) {
        // session expected shape: { id, shop, ... } — store raw
        if (!session || !session.id) {
          throw new Error("Invalid session object");
        }
        this.map.set(session.id, session);
        return session;
      }
      // loadSession(id) -> session | null
      async loadSession(id) {
        return this.map.get(id) ?? null;
      }
      // deleteSession(id) -> boolean
      async deleteSession(id) {
        return this.map.delete(id);
      }
      // findSessionsByShop(shop) -> session[]
      async findSessionsByShop(shop) {
        const out = [];
        for (const s of this.map.values()) {
          if (s && s.shop === shop) out.push(s);
        }
        return out;
      }
    }

    return new MemorySessionStorage();
  }
}

// Create session storage BEFORE creating shopifyApp config
// (we await synchronously because top-level await in some envs may not be OK)
// The shopifyApp factory below expects sessionStorage to be available synchronously
// — so we prepare it using an IIFE and blocking pattern.
let _sessionStoragePromise = createSessionStorage();

let resolvedSessionStorage = null;

// NOTE: on module load we block resolution of the promise to supply correct object.
// Because vite/dev server loads modules synchronously for SSR, we use `.then` to set resolvedSessionStorage.
// The shopifyApp creation below will use a proxy that waits if necessary.
_sessionStoragePromise.then((s) => {
  resolvedSessionStorage = s;
}).catch((e) => {
  // should not happen because createSessionStorage catches errors, but protect anyway
  console.error("[shopify.server] session storage init error:", e && e.message);
});

// A small helper to ensure sessionStorage is available synchronously.
// If not yet resolved, we return a simple in-memory fallback instance immediately.
function getSessionStorageSyncFallback() {
  if (resolvedSessionStorage) return resolvedSessionStorage;
  // If not ready (rare), create a transient memory storage to avoid crash
  // This ensures server can start; later resolvedSessionStorage will be ignored by shopifyApp instance,
  // but in dev that's acceptable.
  console.warn("[shopify.server] session storage not yet initialized — using transient in-memory fallback");
  const map = new Map();
  return {
    storeSession: async (s) => { map.set(s.id, s); return s; },
    loadSession: async (id) => map.get(id) ?? null,
    deleteSession: async (id) => map.delete(id),
    findSessionsByShop: async (shop) => Array.from(map.values()).filter(s => s?.shop === shop),
  };
}

// Use sync getter for passing into shopifyApp constructor
const sessionStorageForConfig = getSessionStorageSyncFallback();

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: sessionStorageForConfig,
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;

// Export the runtime session storage instance (resolved one if available, otherwise the fallback)
export const sessionStorage = {
  get() {
    return resolvedSessionStorage ?? sessionStorageForConfig;
  }
};
