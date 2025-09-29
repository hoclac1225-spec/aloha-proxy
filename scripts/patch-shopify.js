const fs = require("fs");
const path = require("path");
const base = path.join(__dirname, "..", "node_modules", "@shopify", "shopify-app-remix");
if (!fs.existsSync(base)) {
  console.log("shopify-app-remix not installed, skipping patch.");
  process.exit(0);
}
function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) out.push(...walk(full));
    else if (full.endsWith(".mjs") || full.endsWith(".js")) out.push(full);
  }
  return out;
}
const files = walk(base);
let patched = 0;
for (const f of files) {
  const content = fs.readFileSync(f, "utf8");
  if (content.includes("with { type: 'json' }")) {
    const updated = content.split("with { type: 'json' }").join("assert { type: 'json' }");
    fs.writeFileSync(f, updated, "utf8");
    console.log("Patched", f);
    patched++;
  }
}
console.log("Patched files:", patched);
