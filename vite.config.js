// vite.config.js
import path from "path";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import json from "@rollup/plugin-json";

installGlobals({ nativeFetch: true });

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
        // Redirect imports of the package JSON to your JS locale file
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
      // Keep json plugin; alias handles the problematic file.
      json({ namedExports: false, esModule: true }),
    ],
    build: { assetsInlineLimit: 0 },
    optimizeDeps: {
      include: ["@shopify/app-bridge-react", "@shopify/polaris"],
      // exclude not required now but can keep if you used before
      exclude: ["@shopify/polaris/locales/en.json"],
    },
  });
};
