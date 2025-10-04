// Náº¿u HOST Ä‘Æ°á»£c set vÃ  SHOPIFY_APP_URL chÆ°a set hoáº·c trÃ¹ng vá»›i HOST, dÃ¹ng HOST lÃ m URL
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
      strictPort: false, // false Ä‘á»ƒ tá»± tÄƒng port náº¿u báº­n
      host: '127.0.0.1', // Ã©p IPv4
      watchPaths: ["app", "remix.config.cjs"]
    }
  };
  
