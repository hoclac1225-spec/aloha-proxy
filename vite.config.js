// vite.config.js
import fs from "fs";
import path from "path";

import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import json from "@rollup/plugin-json";
import stripBom from "strip-bom";

installGlobals({ nativeFetch: true });

/** Debug plugin: log khi JSON trong thư mục "locales" được load/transform */
function debugJsonLoadPlugin() {
  const outFile = path.resolve(process.cwd(), "debug-json-transform.log");
  // ensure log file exists (appendFileSync will create if missing, but write header first run)
  try {
    if (!fs.existsSync(outFile)) {
      fs.writeFileSync(outFile, `[debug-json-transform log] ${new Date().toISOString()}\n\n`);
    }
  } catch (e) {
    /* ignore */
  }

  return {
    name: "debug-json-load",
    enforce: "pre",
    buildStart() {
      console.log("🔧 debug-json-load plugin active — logging to", outFile);
    },
    load(id) {
      // id may be absolute path; canonicalize to forward slashes for matching
      const normalized = id.replace(/\\/g, "/");
      if (normalized.includes("/locales/") && normalized.endsWith(".json")) {
        console.log(`🔍 [DEBUG-load] id = ${id}`);
        try {
          const stat = fs.statSync(id);
          console.log(`    size=${stat.size} bytes`);
        } catch (e) {
          // ignore
        }
      }
      return null;
    },
    transform(code, id) {
      const normalized = id.replace(/\\/g, "/");
      if (normalized.includes("/locales/") && normalized.endsWith(".json")) {
        const head = code.slice(0, 1000); // preview up to 1000 chars
        console.log("🔍 [DEBUG-transform] id =", id);
        console.log("🔍 [DEBUG-code-preview] first 200 chars:\n", head.slice(0, 200).replace(/\n/g, "\\n"));

        // Append to log file with timestamp and file path
        try {
          fs.appendFileSync(
            outFile,
            `\n[${new Date().toISOString()}] ${id}\n---first 1000 chars---\n${head}\n---end---\n`
          );
        } catch (e) {
          console.error("⚠️ Failed to write debug log:", e && e.message);
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
        {
          find: "@shopify/polaris/locales/en.json",
          replacement: path.resolve(__dirname, "app/locales/en.js"),
        },
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
      // debug plugin first so we see raw loads/transforms before other plugins touch file
      debugJsonLoadPlugin(),

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

      // rollup json plugin used by Vite — keep namedExports false to avoid named export conversion
      json({ namedExports: false, esModule: true }),

      // --- strip BOM plugin ---
      {
        name: "strip-bom",
        transform(code, id) {
          // only apply to text files; strip-bom returns original if none
          return stripBom(code);
        },
      },
    ],
    build: { assetsInlineLimit: 0 },
    optimizeDeps: {
      include: ["@shopify/app-bridge-react", "@shopify/polaris"],
      exclude: ["@shopify/polaris/locales/en.json"],
    },
  });
};
