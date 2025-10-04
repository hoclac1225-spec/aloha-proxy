import path from "path";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";
import stripBom from "strip-bom";
import json from "@rollup/plugin-json";

installGlobals({ nativeFetch: true });

// Plugin nhẹ loại bỏ BOM + debug JSON
function debugJsonPlugin() {
  return {
    name: "debug-json",
    enforce: "pre",
    transform(code, id) {
      if (id.endsWith(".json")) {
        const clean = stripBom(code);
        try {
          const parsed = JSON.parse(clean);
          console.log(`✅ [DEBUG] JSON parse OK: ${id}`);
        } catch (e) {
          console.error(`❌ [DEBUG] JSON parse FAILED: ${id}\n`, e.message);
        }
        return clean;
      }
      return null;
    },
  };
}

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const APP_URL = env.SHOPIFY_APP_URL || process.env.SHOPIFY_APP_URL || "https://aloha-proxy.onrender.com";
  const PORT = Number(env.PORT || process.env.PORT || 10000);

  const host = (() => {
    try { return new URL(APP_URL).hostname; } 
    catch { return "127.0.0.1"; }
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
    server: { host: true, port: PORT, strictPort: true, allowedHosts: [host], origin: APP_URL, hmr: hmrConfig },
    plugins: [
      debugJsonPlugin(), // 🔹 luôn đứng đầu
      json({ compact: false, namedExports: false, preferConst: true, esModule: false }),
      remix({ ignoredRouteFiles: ["**/.*"], future: { v3_fetcherPersist: true, v3_relativeSplatPath: true } }),
      tsconfigPaths(),
    ],
    build: { assetsInlineLimit: 0 },
    optimizeDeps: {
      include: ["@shopify/app-bridge-react", "@shopify/polaris"],
      exclude: ["@shopify/polaris/locales/en.json"],
    },
  });
};
