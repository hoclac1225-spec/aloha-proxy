import path from "path";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import stripBom from "strip-bom";
import fs from "fs";

installGlobals({ nativeFetch: true });

// Plugin convert JSON thành module JS trước khi Rollup parse
function safeJsonPlugin() {
  return {
    name: "safe-json",
    enforce: "pre",
    transform(code, id) {
      if (id.endsWith(".json")) {
        const clean = stripBom(code);
        try { JSON.parse(clean); } catch(e) { console.error(`JSON parse error: ${id}`, e.message); }
        return `export default ${clean}`;
      }
      return null;
    },
  };
}

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const APP_URL = env.SHOPIFY_APP_URL || process.env.SHOPIFY_APP_URL || "https://aloha-proxy.onrender.com";
  const PORT = Number(env.PORT || process.env.PORT || 10000);

  const host = (() => { try { return new URL(APP_URL).hostname; } catch { return "127.0.0.1"; } })();
  const hmrConfig = host === "127.0.0.1" || host === "localhost"
    ? { protocol: "ws", host: "127.0.0.1", port: PORT + 1, clientPort: PORT + 1 }
    : { protocol: "wss", host, clientPort: 443 };

  return defineConfig({
    resolve: {
      alias: [
        { find: "~", replacement: path.resolve(process.cwd(), "app") },
        { find: "~/lib", replacement: path.resolve(process.cwd(), "app/lib") },
        // bỏ alias JSON hoặc vẫn giữ nhưng safeJsonPlugin sẽ xử lý
        { find: "@shopify/polaris/locales/en.json", replacement: path.resolve(process.cwd(), "app/locales/en.json") },
      ],
    },
    plugins: [
      safeJsonPlugin(),
      remix({ ignoredRouteFiles: ["**/.*"] }),
      tsconfigPaths(),
    ],
    server: { host: true, port: PORT, hmr: hmrConfig },
    build: { assetsInlineLimit: 0 },
    optimizeDeps: {
      include: ["@shopify/app-bridge-react", "@shopify/polaris"],
      exclude: ["@shopify/polaris/locales/en.json"],
    },
  });
};
