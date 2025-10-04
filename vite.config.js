import path from "path";
import fs from "fs";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import json from "@rollup/plugin-json";
import stripBom from "strip-bom";

installGlobals({ nativeFetch: true });

// Plugin nhẹ loại bỏ BOM trước khi parse JSON
function stripBomPlugin() {
  return {
    name: "strip-bom-json",
    enforce: "pre",
    transform(code, id) {
      if (id.endsWith(".json")) {
        return stripBom(code);
      }
      return null;
    },
  };
}

// Plugin debug JSON
function debugJsonPlugin() {
  return {
    name: "debug-json-load",
    enforce: "pre",
    transform(code, id) {
      if (id.endsWith(".json")) {
        console.log("🔍 [DEBUG] JSON file:", id);
        console.log("🔍 [DEBUG] Preview first 200 chars:\n", code.slice(0, 200));
        try {
          JSON.parse(code);
          console.log("✅ [DEBUG] JSON parse OK:", id);
        } catch (e) {
          console.error("❌ [DEBUG] JSON parse ERROR:", e.message, "in", id);
        }
      }
      return null;
    },
  };
}

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
        { find: "@shopify/polaris/locales/en.json", replacement: path.resolve(process.cwd(), "app/locales/en.json") },
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
    plugins: [
      stripBomPlugin(),
      debugJsonPlugin(), // <-- plugin debug JSON
      json({
        compact: false,
        namedExports: false,
        preferConst: true,
        esModule: false,
      }),
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
    build: { assetsInlineLimit: 0 },
    optimizeDeps: {
      include: ["@shopify/app-bridge-react", "@shopify/polaris"],
      exclude: ["@shopify/polaris/locales/en.json"],
    },
  });
};
