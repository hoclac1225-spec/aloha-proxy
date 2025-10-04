// vite.config.js
import path from "path";
import fs from "fs";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import json from "@rollup/plugin-json";

installGlobals({ nativeFetch: true });

function debugLocalesPlugin() {
  return {
    name: "debug-locales",
    enforce: "pre",
    transform(code, id) {
      // debug only when vite tries to load our en.json
      if (!id) return null;
      const p = id.replace(/\\/g, "/");
      if (p.endsWith("/app/locales/en.json")) {
        try {
          const preview = String(code).slice(0, 400).replace(/\n/g, "\\n");
          console.log("🔍 [locales-debug] file:", id);
          console.log("🔍 [locales-debug] preview:", preview);
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

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const APP_URL = env.SHOPIFY_APP_URL || process.env.SHOPIFY_APP_URL || "http://localhost:60600";
  const PORT = Number(env.PORT || process.env.PORT || 60600);

  // ensure we consistently redirect any import of polaris locales to our single file
  const appLocalesJson = path.resolve(process.cwd(), "app/locales/en.json");

  return defineConfig({
    resolve: {
      alias: [
        // project aliases
        { find: "~", replacement: path.resolve(process.cwd(), "app") },
        { find: "~/lib", replacement: path.resolve(process.cwd(), "app/lib") },

        // Force any import that requests polaris en.json (or an absolute path) to use app/locales/en.json
        { find: "@shopify/polaris/locales/en.json", replacement: appLocalesJson },
        {
          find: path.resolve(process.cwd(), "node_modules", "@shopify", "polaris", "locales", "en.json"),
          replacement: appLocalesJson,
        },

        // also map any en.mjs (if something imports en.mjs) -> use en.json (keeps single source)
        { find: "@shopify/polaris/locales/en.mjs", replacement: appLocalesJson },
      ],
    },

    server: {
      host: true,
      port: PORT,
      strictPort: false,
      origin: APP_URL,
      hmr: true,
      fs: { allow: ["app", "node_modules"] },
    },

    plugins: [
      debugLocalesPlugin(),
      stripBomJsonPlugin(),
      json({ namedExports: false, preferConst: true, compact: false, esModule: true }),
      remix({ ignoredRouteFiles: ["**/.*"] }),
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
      // exclude the polaris locale JSON so alias above is used consistently
      exclude: ["@shopify/polaris/locales/en.json", "@shopify/polaris/locales/en.mjs"],
    },
  });
};
