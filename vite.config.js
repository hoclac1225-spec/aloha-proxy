import path from "path";
import fs from "fs";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import json from "@rollup/plugin-json";

installGlobals({ nativeFetch: true });

/**
 * Debug plugin: log preview when vite requests app/locales/en.json (or node_modules copy)
 */
function debugLocalesPlugin() {
  return {
    name: "debug-locales",
    enforce: "pre",
    transform(code, id) {
      if (!id) return null;
      const normalized = id.split(path.sep).join(path.posix.sep);
      if (normalized.endsWith("/app/locales/en.json") || normalized.endsWith("/node_modules/@shopify/polaris/locales/en.json")) {
        try {
          const preview = String(code).slice(0, 400).replace(/\n/g, "\\n");
          console.log("🔍 [locales-debug] file:", id);
          console.log("🔍 [locales-debug] preview:", preview);
          // attempt parse (don't throw)
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
 * Strip BOM from any .json content seen by Vite (pre)
 */
function stripBomJsonPlugin() {
  return {
    name: "strip-bom-json",
    enforce: "pre",
    transform(code, id) {
      if (id && id.endsWith(".json") && code && code.charCodeAt(0) === 0xfeff) {
        // remove BOM
        return code.slice(1);
      }
      return null;
    },
  };
}

/**
 * Resolve plugin specifically redirecting en.json imports to our en.mjs file.
 * This ensures import attributes or json plugin inconsistency won't cause double-parsing.
 */
function resolveEnJsonToMjsPlugin(enMjsPath) {
  return {
    name: "resolve-en-json-to-mjs",
    enforce: "pre",
    resolveId(source, importer) {
      if (!source) return null;
      // handle package import and direct paths
      if (source === "@shopify/polaris/locales/en.json") {
        return enMjsPath;
      }
      // also catch absolute node_modules path imports
      if (source.endsWith(path.posix.join("@shopify", "polaris", "locales", "en.json"))
          || source.endsWith(path.join("@shopify", "polaris", "locales", "en.json"))) {
        return enMjsPath;
      }
      // if importer asked for './app/locales/en.json' etc, normalize and redirect
      if (source.endsWith("app/locales/en.json") || source.endsWith("app\\locales\\en.json")) {
        return enMjsPath;
      }
      return null;
    },
    load(id) {
      // if Vite asks to load our enMjsPath, return the file contents (so it's treated as ESM)
      if (id === enMjsPath) {
        return fs.readFileSync(enMjsPath, "utf8");
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

  // prefer an explicit en.mjs in app/locales
  const enMjsPath = path.resolve(process.cwd(), "app/locales/en.mjs");

  return defineConfig({
    resolve: {
      alias: [
        // project aliases
        { find: "~", replacement: path.resolve(process.cwd(), "app") },
        { find: "~/lib", replacement: path.resolve(process.cwd(), "app/lib") },

        // redirect polaris JSON import to our ESM module (en.mjs)
        { find: "@shopify/polaris/locales/en.json", replacement: enMjsPath },
        // also handle node_modules absolute form just in case
        { find: path.resolve(process.cwd(), "node_modules", "@shopify", "polaris", "locales", "en.json"), replacement: enMjsPath },
        // if some code imports app/locales/en.json directly
        { find: path.resolve(process.cwd(), "app/locales/en.json"), replacement: enMjsPath },
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
      // debug + BOM strip plugins first
      debugLocalesPlugin(),
      stripBomJsonPlugin(),

      // plugin to resolve en.json -> en.mjs before rollup json plugin gets involved
      resolveEnJsonToMjsPlugin(enMjsPath),

      // keep rollup json plugin for general JSON handling (we've redirected problematic import)
      json({ namedExports: false, preferConst: true, compact: false, esModule: false }),

      // remix + ts paths
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
      include: ["@shopify/app-bridge-react", "@shopify/polaris"],
      // exclude polaris json so pre-bundling doesn't try to read original json
      exclude: ["@shopify/polaris/locales/en.json"],
    },
  });
};
