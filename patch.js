// patch.cjs
// Sửa " with { type: 'json' }" => " assert { type: 'json' }"
const fs = require('fs');
const path = require('path');

const p = path.join('node_modules','@shopify','shopify-app-remix','dist','esm','react','components','AppProvider','AppProvider.mjs');

if (!fs.existsSync(p)) {
  console.error('File not found:', p);
  process.exit(1);
}

let s = fs.readFileSync(p, 'utf8');

const oldPattern = " with { type: 'json' }";
const newPattern = " assert { type: 'json' }";

if (s.includes(oldPattern)) {
  s = s.split(oldPattern).join(newPattern);
  fs.writeFileSync(p, s, 'utf8');
  console.log('Patched:', p);
} else {
  console.log('Pattern not found (maybe already patched):', p);
}
