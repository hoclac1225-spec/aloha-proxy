// vite.config.js
import path from "path";
import fs from "fs";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import json from "@rollup/plugin-json";

installGlobals({ nativeFetch: true });

// Plugin debug JSON mạnh
function debugJsonPlugin() {
  return {
    name: "debug-json",
    enforce: "pre",
    transform(code, id) {
      if (id.endsWith(".json")) {
        console.log(`\n🔍 [DEBUG] JSON file: ${id}`);
        console.log("Preview first 200 chars:", code.slice(0, 200));
        for (let i = 0; i < code.length; i++) {
          const c = code[i];
          if (c.charCodeAt(0) < 32 && c !== "\n" && c !== "\r" && c !== "\t") {
            console.log(`⚠️  Non-printable char at pos ${i}: charCode=${c.charCodeAt(0)}`);
          }
        }
        try {
          JSON.parse(code);
          console.log("✅ [DEBUG] JSON parse OK");
        } catch (e) {
          console.error("❌ [DEBUG] JSON parse ERROR:", e.message);
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
      debugJsonPlugin(),
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
    build: {
      assetsInlineLimit: 0,
      rollupOptions: {
        external: ["@shopify/shopify-app-remix/server"],
      },
    },
    optimizeDeps: {
      include: ["@shopify/app-bridge-react", "@shopify/polaris"],
      exclude: ["@shopify/polaris/locales/en.json", "@shopify/shopify-app-remix/server"],
    },
  });
};
