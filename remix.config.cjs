// remix.config.cjs
// Nếu HOST được set và SHOPIFY_APP_URL chưa set hoặc trùng với HOST, dùng HOST làm URL
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
  serverBuildPath: "build/server/index.cjs",
  publicPath: "/build/",
  serverModuleFormat: "cjs",
  ignoredRouteFiles: ["**/.*"],

  serverDependenciesToBundle: [
    /^@shopify\/polaris(\/.*)?$/,
    /^@shopify\/shopify-app-remix(\/.*)?$/
  ],

  dev: {
    port: Number(process.env.PORT) || 60600,
    strictPort: false,
    host: "127.0.0.1",
    watchPaths: ["app", "remix.config.cjs"]
  }
};
