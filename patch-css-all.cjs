// patch-css-all.cjs
// Quét node_modules/@shopify/polaris và comment mọi dòng import liên quan đến .css
const fs = require('fs');
const path = require('path');

const root = path.join('node_modules','@shopify','polaris','build','esm');

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(fp);
    } else if (e.isFile() && (fp.endsWith('.js') || fp.endsWith('.mjs') || fp.endsWith('.cjs'))) {
      try {
        let s = fs.readFileSync(fp, 'utf8');
        const lines = s.split(/\r?\n/);
        let changed = false;
        for (let i = 0; i < lines.length; i++) {
          const t = lines[i].trim();
          // match imports that reference .css (single or double quotes)
          if (/^import\s+(['"].+\.css['"]);?$/.test(t) ||
              /^import\s+.*from\s+['"].+\.css['"];?$/.test(t) ||
              /^export\s+.*from\s+['"].+\.css['"];?$/.test(t)
             ) {
            // if already commented, skip
            if (!lines[i].trimStart().startsWith('//')) {
              lines[i] = '// ' + lines[i];
              changed = true;
            }
          }
        }
        if (changed) {
          fs.writeFileSync(fp, lines.join('\n'), 'utf8');
          console.log('Patched CSS imports:', fp);
        }
      } catch (err) {
        // ignore read errors
      }
    }
  }
}

if (!fs.existsSync(root)) {
  console.error('Polaris ESM folder not found:', root);
  process.exit(1);
}

walk(root);
console.log('Done patching polaris CSS imports.');
