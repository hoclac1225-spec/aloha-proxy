// server.js
// Chỉ dùng để start build output (Remix server bundle).
import http from "node:http";
import { fileURLToPath } from "node:url";
import path from "path";
import { spawnSync } from "child_process";

const PORT = process.env.PORT || 3000;

// Nếu build output không tồn tại, gợi ý build
const buildPath = path.resolve(process.cwd(), "build", "server", "index.cjs");
try {
  // Check file exists
  await import('fs').then(fs => {
    if (!fs.existsSync(buildPath)) {
      console.error("Build file not found:", buildPath);
      console.error("Chạy `npm run build` trước khi start.");
      process.exit(1);
    }
  });
} catch (e) {
  console.error("Kiểm tra build failed:", e);
  process.exit(1);
}

// Khởi chạy bundle bằng node child (an toàn hơn so chạy require/do chuyển đổi module type)
const child = spawnSync(process.execPath, [buildPath], {
  stdio: "inherit",
  env: process.env
});

if (child.error) {
  console.error("Failed to start build server:", child.error);
  process.exit(1);
}
