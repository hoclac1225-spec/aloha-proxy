// patch-polaris-css.cjs
// Tìm các import *.css trong node_modules/@shopify/polaris/build/esm
// và comment chúng (thay 'import ...' => '// import ...')
// Chạy bằng: node patch-polaris-css.cjs

const fs = require('fs');
const path = require('path');

const root = path.join('node_modules','@shopify','polaris','build','esm');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(fp);
    } else if (e.isFile() && (fp.endsWith('.js') || fp.endsWith('.mjs') || fp.endsWith('.cjs'))) {
      let s = fs.readFileSync(fp, 'utf8');
      if (s.includes('.css')) {
        // find import lines that reference .css
        const lines = s.split(/\r?\n/);
        let changed = false;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          // match typical import forms
          if (/^import\s+['"].+\.css['"];?$/.test(line) || /^import\s+.*from\s+['"].+\.css['"];?$/.test(line)) {
            // comment out that line
            lines[i] = '// ' + lines[i];
            changed = true;
          }
        }
        if (changed) {
          fs.writeFileSync(fp, lines.join('\n'), 'utf8');
          console.log('Patched:', fp);
        }
      }
    }
  }
}

if (!fs.existsSync(root)) {
  console.error('Polaris ESM folder not found:', root);
  process.exit(1);
}

walk(root);
console.log('Done.');
