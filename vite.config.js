import path from "path";
import fs from "fs";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import json from "@rollup/plugin-json";

installGlobals({ nativeFetch: true });

/**
 * Debug plugin: log preview file JSON khi vite/rollup request file locales/en.json
 * (chỉ log, KHÔNG thay đổi nội dung) — giúp thấy nội dung trước khi plugin json parse.
 */
function debugLocalesPlugin() {
  return {
    name: "debug-locales",
    enforce: "pre",
    transform(code, id) {
      const targetPosix = path.posix.join("app", "locales", "en.json");
      const targetWin = path.join("app", "locales", "en.json");
      if (id.endsWith(targetPosix) || id.endsWith(targetWin) || id.includes(`${path.sep}app${path.sep}locales${path.sep}en.json`)) {
        try {
          const preview = String(code).slice(0, 400).replace(/\n/g, "\\n");
          console.log("🔍 [locales-debug] file:", id);
          console.log("🔍 [locales-debug] preview:", preview);
          // also try parse (but do not throw)
          JSON.parse(String(code));
          console.log("✅ [locales-debug] JSON.parse OK");
        } catch (e) {
          console.warn("⚠️ [locales-debug] JSON.parse FAILED:", e && e.message);
        }
      }
      return null;
    },
  };
}

/**
 * Lightweight pre-transform that strips BOM from any .json file content
 * before other plugins run (prevents UTF-8 BOM causing subtle parse issues)
 */
function stripBomJsonPlugin() {
  return {
    name: "strip-bom-json",
    enforce: "pre",
    transform(code, id) {
      if (id && id.endsWith(".json")) {
        // remove BOM if present
        if (code && code.charCodeAt(0) === 0xfeff) {
          return code.slice(1);
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
        // project aliases
        { find: "~", replacement: path.resolve(process.cwd(), "app") },
        { find: "~/lib", replacement: path.resolve(process.cwd(), "app/lib") },

        // MOST IMPORTANT:
        // map imports that request Polaris' en.json -> our app/locales/en.json
        // this avoids vite/rollup attempting to parse a broken node_modules file
        { find: "@shopify/polaris/locales/en.json", replacement: path.resolve(process.cwd(), "app/locales/en.json") },

        // Also map possible absolute path forms to be safe:
        { find: path.resolve(process.cwd(), "node_modules", "@shopify", "polaris", "locales", "en.json"), replacement: path.resolve(process.cwd(), "app/locales/en.json") },
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

    // configure JSON plugin and our debug/strip-bom plugins
    plugins: [
      debugLocalesPlugin(),
      stripBomJsonPlugin(),
      // use rollup json plugin (so imports from node_modules and our alias are handled consistently)
      json({ namedExports: false, preferConst: true, compact: false, esModule: false }),

      // remix plugin
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

      // path mapping
      tsconfigPaths(),
    ],

    build: {
      assetsInlineLimit: 0,
      rollupOptions: {
        // nếu bạn biết module server-only cần external -> thêm ở đây
        external: [],
      },
    },

    optimizeDeps: {
      include: ["@shopify/app-bridge-react", "@shopify/polaris"],
      // Important: exclude the polaris JSON if you will override it via alias
      exclude: ["@shopify/polaris/locales/en.json"],
    },
  });
};
