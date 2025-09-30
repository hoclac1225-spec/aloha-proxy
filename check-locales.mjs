// check-locales.mjs
import fs from "fs";
import path from "path";

function hexHead(buf, len = 80) {
  const slice = buf.slice(0, Math.min(buf.length, len));
  return Buffer.from(slice).toString("hex");
}

function printFileInfo(full) {
  try {
    const stat = fs.statSync(full);
    const size = stat.size;
    const raw = fs.readFileSync(full);
    const head = hexHead(raw, 80);
    const text = raw.toString("utf8");
    const first200 = text.slice(0, 200);
    console.log("[FILE] ", full);
    console.log("  size:", size);
    console.log("  hex-head (first 80 bytes):", head);
    console.log("  first-200:", first200.replace(/\r?\n/g, "\\n"));
    try {
      JSON.parse(text);
      console.log("  JSON.parse: OK");
    } catch (e) {
      console.error("  JSON.parse: ERROR ->", e.message);
      throw e;
    }
  } catch (e) {
    console.error("[ERR] cannot read file", full, e.message);
    throw e;
  }
}

let hadError = false;

function checkJSON(dir) {
  if (!fs.existsSync(dir)) {
    console.error("[ERROR] Locales directory not found:", dir);
    process.exit(2);
  }
  const items = fs.readdirSync(dir);
  for (const name of items) {
    const full = path.join(dir, name);
    try {
      const s = fs.statSync(full);
      if (s.isDirectory()) {
        checkJSON(full);
      } else if (name.endsWith(".json")) {
        try {
          printFileInfo(full);
        } catch (e) {
          hadError = true;
          console.error("[INVALID]", full, e.message);
        }
      }
    } catch (e) {
      console.error("[ERROR] reading", full, e.message);
      hadError = true;
    }
  }
}

const localesDir = path.join(process.cwd(), "app", "locales");
try {
  checkJSON(localesDir);
} catch (e) {
  console.error("[FATAL] error while checking locales:", e.message);
  process.exit(2);
}

if (hadError) {
  console.error("[RESULT] One or more invalid JSON files found");
  process.exit(2);
} else {
  console.log("[RESULT] All JSON files OK");
  process.exit(0);
}
