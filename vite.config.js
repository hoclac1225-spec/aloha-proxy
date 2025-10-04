import path from "path";
import fs from "fs";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import json from "@rollup/plugin-json";

installGlobals({ nativeFetch: true });

/**
 * Plugin debug: log preview file JSON khi vite/rollup request file locales/en.json
 * (chỉ log, KHÔNG thay đổi nội dung) — giúp thấy nội dung trước khi plugin json parse.
 */
function debugLocalesPlugin() {
  return {
    name: "debug-locales",
    enforce: "pre",
    transform(code, id) {
      if (!id) return null;
      const posixTarget = path.posix.join("app", "locales", "en.json");
      const winTarget = path.join(process.cwd(), "app", "locales", "en.json");
      if (id.endsWith(posixTarget) || id.endsWith(winTarget) || id.includes(`${path.sep}app${path.sep}locales${path.sep}en.json`)) {
        try {
          const preview = (typeof code === "string" ? code : String(code)).slice(0, 400);
          console.log("🔍 [locales-debug] file:", id);
          console.log("🔍 [locales-debug] preview:", preview.replace(/\n/g, "\\n"));
          // thử parse để kiểm tra (không throw lên)
          JSON.parse(code);
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
 * Plugin strip BOM: xóa BOM nếu có trước khi Rollup/json plugin xử lý
 */
function stripBomJsonPlugin() {
  return {
    name: "strip-bom-json",
    enforce: "pre",
    transform(code, id) {
      if (id && id.endsWith(".json") && code && code.charCodeAt && code.charCodeAt(0) === 0xfeff) {
        return code.slice(1);
      }
      return null;
    },
  };
}

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const APP_URL = env.SHOPIFY_APP_URL || process.env.SHOPIFY_APP_URL || "http://localhost:60600";
  const PORT = Number(env.PORT || process.env.PORT || 60600);

  // host để HMR / allowedHosts
  const hostFromUrl = (() => {
    try {
      return new URL(APP_URL).hostname;
    } catch {
      return "127.0.0.1";
    }
  })();

  const hmrConfig =
    hostFromUrl === "127.0.0.1" || hostFromUrl === "localhost"
      ? { protocol: "ws", host: "127.0.0.1", port: PORT + 1, clientPort: PORT + 1 }
      : { protocol: "wss", host: hostFromUrl, clientPort: 443 };

  // đường tới file locales trong project (đảm bảo dùng 1 file duy nhất)
  const appLocalesJson = path.resolve(process.cwd(), "app", "locales", "en.json");

  return defineConfig({
    resolve: {
      alias: [
        // alias dự án
        { find: "~", replacement: path.resolve(process.cwd(), "app") },
        { find: "~/lib", replacement: path.resolve(process.cwd(), "app/lib") },

        // IMPORTANT: map mọi dạng import của Polaris locale sang một file duy nhất
        { find: "@shopify/polaris/locales/en.json", replacement: appLocalesJson },
        { find: "@shopify/polaris/locales/en.mjs", replacement: appLocalesJson },
        { find: "@shopify/polaris/locales/en.js", replacement: appLocalesJson },
        // map đường dẫn tuyệt đối node_modules -> app/locales/en.json (phòng trường hợp module import bằng đường tuyệt đối)
        {
          find: path.resolve(process.cwd(), "node_modules", "@shopify", "polaris", "locales", "en.json"),
          replacement: appLocalesJson,
        },
        {
          find: path.resolve(process.cwd(), "node_modules", "@shopify", "polaris", "locales", "en.mjs"),
          replacement: appLocalesJson,
        },
        {
          find: path.resolve(process.cwd(), "node_modules", "@shopify", "polaris", "locales", "en.js"),
          replacement: appLocalesJson,
        },
      ],
    },

    server: {
      host: true,
      port: PORT,
      strictPort: false,
      origin: APP_URL,
      hmr: hmrConfig,
      // cho phép vite đọc app và node_modules
      fs: { allow: ["app", "node_modules"] },
      // optional: whitelist host nếu cần
      allowedHosts: [hostFromUrl, ".trycloudflare.com"],
    },

    // cấu hình json & plugin debug/strip-bom
    plugins: [
      debugLocalesPlugin(),
      stripBomJsonPlugin(),
      // rollup json plugin (xử lý import JSON đồng nhất)
      json({ namedExports: false, preferConst: true, compact: false, esModule: false }),

      // remix + path mapping
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
        external: [],
      },
    },

    optimizeDeps: {
      // include các lib cần optimize
      include: ["@shopify/app-bridge-react", "@shopify/polaris"],
      // exclude chính xác các đường dẫn locale để vite không auto-include nhiều phiên bản
      exclude: [
        "@shopify/polaris/locales/en.json",
        "@shopify/polaris/locales/en.mjs",
        "@shopify/polaris/locales/en.js",
      ],
    },

    define: {
      "process.env": {},
    },

    // small perf tweak: cho phép fs đọc chỉ app và node_modules
    // (đã set phía trên trong server.fs)
  });
};
