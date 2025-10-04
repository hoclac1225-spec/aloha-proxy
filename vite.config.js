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
    transform(code, id) {
      if (id.endsWith("/app/locales/en.json") || id.endsWith("\\app\\locales\\en.json")) {
        try {
          const preview = (typeof code === "string" ? code : String(code)).slice(0, 400);
          console.log("🔍 [DEBUG] JSON file:", id);
          console.log("Preview first 200 chars:", preview.slice(0, 200).replace(/\n/g, "\\n"));
          JSON.parse(code);
          console.log("✅ [DEBUG] JSON parse OK");
        } catch (e) {
          console.warn("⚠️ [DEBUG] JSON parse failed:", e && e.message);
        }
      }
      return null;
    },
  };
}

// Nếu có module yêu cầu JSON từ node_modules, chúng ta redirect sang file JS của bạn
// để tránh Vite/rollup phải parse JSON mà gây lỗi.
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
        // map bất kỳ import tới en.json sang en.js do bạn đã tạo
        { find: "@shopify/polaris/locales/en.json", replacement: path.resolve(process.cwd(), "app/locales/en.js") },
        // nếu có import bằng đường dẫn trực tiếp trong module (hiếm), bạn có thể thêm:
        { find: path.resolve(process.cwd(), "app/locales/en.json"), replacement: path.resolve(process.cwd(), "app/locales/en.js") },
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

    // cấu hình json và plugin debug
    json: {
      namedExports: false,
      stringify: false,
    },

    plugins: [
      debugJsonLoadPlugin(),
      // plugin json rollup (vẫn giữ, nhưng alias sẽ chuyển import sang JS)
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
        // nếu có module server-only bạn muốn externalize, thêm ở đây
        external: [],
      },
    },

    optimizeDeps: {
      include: ["@shopify/app-bridge-react", "@shopify/polaris"],
      exclude: ["@shopify/polaris/locales/en.json"],
    },
  });
};

