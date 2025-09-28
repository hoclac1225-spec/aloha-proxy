// remix.config.cjs
// Config Remix cho project với "type": "module" trong package.json
// Xuất server dạng CommonJS để tương thích với start script và Shopify CLI.

if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL || process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  // Remix sẽ build server-side vào đây, tương thích với "start" script của bạn
  serverBuildPath: "build/server/index.cjs",
  publicPath: "/build/",
  serverModuleFormat: "cjs",           // <-- xuất CommonJS
  ignoredRouteFiles: ["**/.*"],
  dev: { port: Number(process.env.PORT) || 60541 }, // port cố định (fallback)
  future: {
    v3_routeConfig: true,
    v3_lazyRouteDiscovery: true,
    v3_relativeSplatPath: true,
    v3_fetcherPersist: true,
    v3_throwAbortReason: true,
    v3_singleFetch: false
  }
};
