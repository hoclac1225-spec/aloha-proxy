// scripts/postinstall-patch-shopify.js
// Loại bỏ 'with { type: "json" }' khỏi các file trong @shopify
// Giúp tránh lỗi build trên Windows và môi trường không hỗ trợ import assertion

import fs from "fs";
import path from "path";

function log(...args) {
  console.log("[postinstall-patch-shopify]", ...args);
}

try {
  const root = process.cwd();
  const shopifyDir = path.join(root, "node_modules", "@shopify");

  if (!fs.existsSync(shopifyDir)) {
    log("Không tìm thấy thư mục @shopify trong node_modules — patch sẽ bị bỏ qua.");
  } else {
    const exts = [".mjs", ".js", ".cjs", ".jsx", ".ts", ".tsx"];
    const files = [];

    // Hàm đệ quy quét file
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

        // Chỉ chạy regex nếu file thực sự chứa chuỗi cần thay
        if (txt.includes("with { type: \"json\" }")) {
          const newTxt = txt.replace(re, ";");
          fs.writeFileSync(f, newTxt, "utf8");
          patched++;
          log("Đã sửa:", path.relative(root, f));
        }
      } catch (e) {
        log("Bỏ qua lỗi ở:", path.relative(root, f), "-", e.message);
      }
    }

    log(`Hoàn tất. Tổng số file được sửa: ${patched}`);
  }
} catch (err) {
  console.error("[postinstall-patch-shopify] Lỗi ngoài ý muốn:", err.message);
}
