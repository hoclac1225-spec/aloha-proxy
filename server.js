// server.js
// Run the built Remix server bundle as a child process and forward signals.
// This wrapper ensures better signal handling in containers and clearer errors.

import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const buildPath = path.resolve(process.cwd(), "build", "server", "index.cjs");
const port = process.env.PORT || "3000";

if (!fs.existsSync(buildPath)) {
  console.error("Build file not found:", buildPath);
  console.error("Please run `npm run build` before starting.");
  process.exit(1);
}

console.log(`Starting built server: ${buildPath}`);
console.log(`PORT=${port}`);

const child = spawn(process.execPath, [buildPath], {
  stdio: "inherit",
  env: { ...process.env, PORT: port },
});

// forward signals to child so process can terminate gracefully
const signals = ["SIGINT", "SIGTERM", "SIGHUP"];
signals.forEach((sig) => {
  process.on(sig, () => {
    if (!child.killed) {
      console.log(`Main process received ${sig}, forwarding to child...`);
      child.kill(sig);
    }
  });
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.log(`Child exited with signal ${signal}`);
    process.exit(1);
  } else {
    console.log(`Child exited with code ${code}`);
    process.exit(code ?? 0);
  }
});

child.on("error", (err) => {
  console.error("Failed to start child process:", err);
  process.exit(1);
});
