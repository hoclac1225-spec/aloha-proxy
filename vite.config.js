// vite.config.js
import path from "path";
import fs from "fs";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import json from "@rollup/plugin-json";
import stripBom from "strip-bom";

installGlobals({ nativeFetch: true });

// Debug plugin JSON
function debugJsonLoadPlugin() {
  return {
    name: "debug-json-load",
    enforce: "pre",
    load(id) {
      if (id.includes(`${path.sep}locales${path.sep}`) && id.endsWith(".json")) {
        console.log("🔍 [DEBUG-load] id =", id);
      }
      return null;
    },
    transform(code, id) {
      if (id.includes(`${path.sep}locales${path.sep}`) && id.endsWith(".json")) {
        const cleaned = stripBom(code);
        console.log("🔍 [DEBUG-transform] id =", id);
        console.log("🔍 [DEBUG-code-preview] first 200 chars:\n", cleaned.slice(0, 200));
        try {
          JSON.parse(cleaned);
          console.log("🔍 [DEBUG-transform] JSON.parse OK for", id);
        } catch (e) {
          console.error("❌ [DEBUG-transform] JSON.parse ERROR for", id, ":", e.message);
        }
        const out = path.resolve(process.cwd(), "debug-json-transform.log");
        try {
          fs.appendFileSync(
            out,
            `\n[${new Date().toISOString()}] ${id}\n${cleaned.slice(0, 1000)}\n---\n`
          );
        } catch (e) {
          console.error("Could not write debug-json-transform.log:", e.message);
        }
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
        { find: "~", replacement: path.resolve(__dirname, "app") },
        { find: "~/lib", replacement: path.resolve(__dirname, "app/lib") },
        { find: "@shopify/polaris/locales/en.json", replacement: path.resolve(__dirname, "app/locales/en.json") },
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
      debugJsonLoadPlugin(),
      {
        name: "strip-bom-first",
        enforce: "pre",
        transform(code, id) {
          if (id.endsWith(".json")) return stripBom(code);
          return null;
        },
      },
      json({ namedExports: false, esModule: false }), // parse JSON thuần
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