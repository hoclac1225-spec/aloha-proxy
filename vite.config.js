// vite.config.js
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import json from "@rollup/plugin-json";

installGlobals({ nativeFetch: true });

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // URL app trên Render hoặc local dev
  const APP_URL = env.SHOPIFY_APP_URL || process.env.SHOPIFY_APP_URL || "http://127.0.0.1:60600";
  const PORT = Number(env.PORT || process.env.PORT || 60600);

  const host = (() => {
    try { return new URL(APP_URL).hostname; } catch { return "127.0.0.1"; }
  })();

  // HMR chỉ bật local dev
  const hmrConfig = host === "127.0.0.1" || host === "localhost"
    ? { protocol: "ws", host: "127.0.0.1", port: PORT + 1, clientPort: PORT + 1 }
    : undefined;

  return defineConfig({
    server: {
      host: true,
      port: PORT,
      strictPort: true,
      allowedHosts: [host], // chỉ cần host của app
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
      json({ namedExports: false, esModule: true }),
    ],
    build: { assetsInlineLimit: 0 },
    optimizeDeps: { 
      include: ["@shopify/app-bridge-react", "@shopify/polaris"],
      exclude: ["@shopify/polaris/locales/en.json"], // tránh lỗi import JSON Polaris
    },
  });
};
