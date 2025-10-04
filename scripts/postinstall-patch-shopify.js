// scripts/postinstall-patch-shopify.js
// T? d?ng lo?i b? 'with { type: "json" }' kh?i các file trong @shopify
// Giúp tránh l?i build trên Windows và các môi tru?ng không h? tr? import assertion.

import fs from "fs";
import path from "path";

function log(...args) {
  console.log("[postinstall-patch-shopify]", ...args);
}

try {
  const root = process.cwd();
  const shopifyDir = path.join(root, "node_modules", "@shopify");

  if (!fs.existsSync(shopifyDir)) {
    log("Không tìm th?y thu m?c @shopify trong node_modules — b? qua patch.");
    process.exit(0);
  }

  const exts = [".mjs", ".js", ".cjs", ".jsx", ".ts", ".tsx"];
  const files = [];

  function walk(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const it of items) {
      const full = path.join(dir, it.name);
      if (it.isDirectory()) {
        walk(full);
      } else if (exts.includes(path.extname(it.name))) {
        files.push(full);
      }
    }
  }

  walk(shopifyDir);

  const re = /\s+with\s*\{\s*type\s*:\s*['"]json['"]\s*\}\s*;?/gi;
  let patched = 0;

  for (const f of files) {
    try {
      const txt = fs.readFileSync(f, "utf8");
      if (re.test(txt)) {
        const newTxt = txt.replace(re, ";");
        fs.writeFileSync(f, newTxt, "utf8");
        patched++;
        log("Ðã s?a:", path.relative(root, f));
      }
    } catch (e) {
      log("B? qua l?i ?:", path.relative(root, f), "-", e.message);
    }
  }

  log(`Hoàn t?t. T?ng s? file du?c s?a: ${patched}`);
  process.exit(0);
} catch (err) {
  console.error("[postinstall-patch-shopify] L?i ngoài ý mu?n:", err.message);
  process.exit(0);
}
