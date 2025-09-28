// find-active-css-imports.cjs
// Liệt kê chỉ những dòng import/export tham chiếu tới .css KHÔNG bị comment
const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(root)) { console.error('node_modules not found'); process.exit(1); }

const exts = ['.js','.mjs','.cjs'];
const results = [];

function isCommented(line) {
  const t = line.trim();
  return t.startsWith('//') || t.startsWith('/*') || t.startsWith('*') || t.startsWith('<!--');
}

function scanFile(fp){
  try{
    const content = fs.readFileSync(fp, 'utf8');
    if (!content.includes('.css')) return;
    const lines = content.split(/\r?\n/);
    for (let i=0;i<lines.length;i++){
      const raw = lines[i];
      if (raw.indexOf('.css') === -1) continue;
      const trimmed = raw.trim();
      if (isCommented(raw)) continue;
      // match import ... '...css' OR import '...css' OR export ... from '...css' OR dynamic import('...css')
      if (/^\s*import\s+.*['"].+\.css['"]\s*;?\s*$/.test(raw) ||
          /^\s*import\s+['"].+\.css['"]\s*;?\s*$/.test(raw) ||
          /^\s*export\s+.*from\s+['"].+\.css['"]\s*;?\s*$/.test(raw) ||
          /import\(['"].+\.css['"]\)/.test(raw) ||
          /from\s+['"].+\.css['"]/.test(raw)
         ){
        results.push({file: fp, line: i+1, text: raw.trim()});
      }
    }
  }catch(e){}
}

function walk(dir){
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of list){
    const fp = path.join(dir, e.name);
    try{
      if (e.isDirectory()) {
        // skip some heavy/irrelevant folders to speed up
        if (['.bin','@types'].includes(e.name)) continue;
        walk(fp);
      } else if (e.isFile()){
        if (exts.includes(path.extname(e.name))) scanFile(fp);
      }
    }catch(e){}
  }
}

console.log('Scanning node_modules for active CSS imports (this may take up to ~30s)...');
walk(root);
if (!results.length) {
  console.log('NO ACTIVE CSS IMPORTS FOUND');
  process.exit(0);
}
for (const r of results) {
  console.log('---');
  console.log(r.file);
  console.log('  line', r.line + ':', r.text);
}
console.log('---');
console.log('Found', results.length, 'active CSS import lines.');
