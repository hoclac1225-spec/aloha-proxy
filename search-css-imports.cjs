// search-css-imports.cjs
// Liệt kê file trong node_modules (.js .mjs .cjs) có chuỗi ".css" (đường dẫn + dòng)
const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(root)) {
  console.error('node_modules not found at', process.cwd());
  process.exit(1);
}

const exts = ['.js','.mjs','.cjs'];
const results = [];

function walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const fp = path.join(dir, it.name);
    try {
      if (it.isDirectory()) {
        walk(fp);
      } else if (it.isFile() && exts.includes(path.extname(it.name))) {
        const content = fs.readFileSync(fp, 'utf8');
        if (content.includes('.css')) {
          // collect file + lines containing .css
          const lines = content.split(/\r?\n/);
          const hits = [];
          lines.forEach((ln, i) => {
            if (ln.includes('.css')) hits.push({line: i+1, text: ln.trim()});
          });
          if (hits.length) results.push({file: fp, hits});
        }
      }
    } catch (e) {
      // ignore unreadable
    }
  }
}

console.log('Scanning (this may take 10-60s depending on node_modules size)...');
walk(root);
if (!results.length) {
  console.log('NO FILES FOUND');
  process.exit(0);
}
for (const r of results) {
  console.log('---');
  console.log(r.file);
  for (const h of r.hits) {
    console.log('  line', h.line + ':', h.text);
  }
}
console.log('---');
console.log('Found', results.length, 'files.');
