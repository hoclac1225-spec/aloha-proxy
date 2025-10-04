import path from "path";
import json from "@rollup/plugin-json";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";

installGlobals({ nativeFetch: true });

// strip BOM plugin
function stripBomJsonPlugin() {
  return {
    name: "strip-bom-json",
    enforce: "pre",
    transform(code, id) {
      if (id && id.endsWith(".json")) {
        if (code && code.charCodeAt(0) === 0xfeff) return code.slice(1);
      }
      return null;
    },
  };
}

// debug plugin (giúp log file được Rollup đọc)
function debugLocalesPlugin() {
  return {
    name: "debug-locales",
    enforce: "pre",
    transform(code, id) {
      if (!id) return null;
      const target1 = path.posix.join("app", "locales", "en.json");
      const target2 = path.join(process.cwd(), "app", "locales", "en.json");
      if (id.endsWith(target1) || id.endsWith(target2) || id.includes(`${path.sep}app${path.sep}locales${path.sep}en.json`)) {
        try {
          console.log("🔍 [locales-debug] file:", id);
          const preview = String(code).slice(0, 400).replace(/\n/g, "\\n");
          console.log("🔍 [locales-debug] preview:", preview);
          JSON.parse(String(code)); // test parse tại đây
          console.log("✅ [locales-debug] JSON.parse OK");
        } catch (e) {
          console.warn("⚠️ [locales-debug] JSON.parse FAILED:", e && e.message);
        }
      }
      return null;
    },
  };
}

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    resolve: {
      alias: [
        { find: "~", replacement: path.resolve(process.cwd(), "app") },
        { find: "~/lib", replacement: path.resolve(process.cwd(), "app/lib") },

        // IMPORTANT: mọi đường dẫn tới polaris locale phải map tới cùng 1 file JSON trong app
        { find: "@shopify/polaris/locales/en.json", replacement: path.resolve(process.cwd(), "app/locales/en.json") },
        { find: path.resolve(process.cwd(), "node_modules", "@shopify", "polaris", "locales", "en.json"), replacement: path.resolve(process.cwd(), "app/locales/en.json") },

        // nếu có chỗ import en.mjs/en.js thì map luôn về en.json
        { find: "@shopify/polaris/locales/en.mjs", replacement: path.resolve(process.cwd(), "app/locales/en.json") },
        { find: "@shopify/polaris/locales/en.js", replacement: path.resolve(process.cwd(), "app/locales/en.json") },
      ],
    },

    plugins: [
      debugLocalesPlugin(),
      stripBomJsonPlugin(),
      // rollup json plugin: parse cả node_modules và alias-ed JSON nhất quán
      json({ namedExports: false, preferConst: true, compact: false, esModule: false }),
      remix({ ignoredRouteFiles: ["**/.*"] }),
      tsconfigPaths(),
    ],

    optimizeDeps: {
      include: ["@shopify/app-bridge-react", "@shopify/polaris"],
      // nếu bạn đã alias en.json, exclude chính xác en.json path
      exclude: ["@shopify/polaris/locales/en.json", "@shopify/polaris/locales/en.mjs", "@shopify/polaris/locales/en.js"],
    },

    // tuỳ chọn server/build khác giữ nguyên
  });
};
