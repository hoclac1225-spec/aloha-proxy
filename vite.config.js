﻿import path from "path";
import fs from "fs";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import json from "@rollup/plugin-json";

installGlobals({ nativeFetch: true });

// nháº¹: debug JSON load cho locales (ghi log ngáº¯n)
function debugJsonLoadPlugin() {
  return {
    name: "debug-json-load",
    enforce: "pre",
    transform(code, id) {
      if (id.endsWith("/app/locales/en.js") || id.endsWith("\\app\\locales\\en.js")) {
        try {
          const preview = (typeof code === "string" ? code : String(code)).slice(0, 400);
          console.log("ðŸ” [DEBUG] JSON file:", id);
          console.log("Preview first 200 chars:", preview.slice(0, 200).replace(/\n/g, "\\n"));
          JSON.parse(code);
          console.log("âœ… [DEBUG] JSON parse OK");
        } catch (e) {
          console.warn("âš ï¸ [DEBUG] JSON parse failed:", e && e.message);
        }
      }
      return null;
    },
  };
}

// Náº¿u cÃ³ module yÃªu cáº§u JSON tá»« node_modules, chÃºng ta redirect sang file JS cá»§a báº¡n
// Ä‘á»ƒ trÃ¡nh Vite/rollup pháº£i parse JSON mÃ  gÃ¢y lá»—i.
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const APP_URL =
    env.SHOPIFY_APP_URL || process.env.SHOPIFY_APP_URL || "https://aloha-proxy.onrender.com";
  const PORT = Number(env.PORT || process.env.PORT || 10000);

  const host = (() => {
    try {
      return new URL(APP_URL).hostname;
    } catch {
      return "127.0.0.1";
    }
  })();

  const hmrConfig =
    host === "127.0.0.1" || host === "localhost"
      ? { protocol: "ws", host: "127.0.0.1", port: PORT + 1, clientPort: PORT + 1 }
      : { protocol: "wss", host, clientPort: 443 };

  return defineConfig({
    resolve: {
      alias: [
        { find: "~", replacement: path.resolve(process.cwd(), "app") },
        { find: "~/lib", replacement: path.resolve(process.cwd(), "app/lib") },
        // map báº¥t ká»³ import tá»›i en.js sang en.js do báº¡n Ä‘Ã£ táº¡o
        { find: "@shopify/polaris/locales/en.js", replacement: path.resolve(process.cwd(), "app/locales/en.js") },
        // náº¿u cÃ³ import báº±ng Ä‘Æ°á»ng dáº«n trá»±c tiáº¿p trong module (hiáº¿m), báº¡n cÃ³ thá»ƒ thÃªm:
        { find: path.resolve(process.cwd(), "app/locales/en.js"), replacement: path.resolve(process.cwd(), "app/locales/en.js") },
      ],
    },

    server: {
      host: true,
      port: PORT,
      strictPort: true,
      allowedHosts: [
        host,
        ".trycloudflare.com",
        (hostname) => hostname.endsWith(".ngrok-free.app"),
        (hostname) => hostname.endsWith(".ngrok.io"),
      ],
      origin: APP_URL,
      hmr: hmrConfig,
      fs: { allow: ["app", "node_modules"] },
    },

    // cáº¥u hÃ¬nh json vÃ  plugin debug
    json: {
      namedExports: false,
      stringify: false,
    },

    plugins: [
      debugJsonLoadPlugin(),
      // plugin json rollup (váº«n giá»¯, nhÆ°ng alias sáº½ chuyá»ƒn import sang JS)
      json({ namedExports: false, compact: false, preferConst: true, esModule: false }),
      remix({
        ignoredRouteFiles: ["**/.*"],
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_lazyRouteDiscovery: true,
          v3_singleFetch: false,
          v3_routeConfig: true,
        },
      }),
      tsconfigPaths(),
    ],

    build: {
      assetsInlineLimit: 0,
      rollupOptions: {
        // náº¿u cÃ³ module server-only báº¡n muá»‘n externalize, thÃªm á»Ÿ Ä‘Ã¢y
        external: [],
      },
    },

    optimizeDeps: {
      include: ["@shopify/app-bridge-react", "@shopify/polaris"],
      exclude: ["@shopify/polaris/locales/en.js"],
    },
  });
};
