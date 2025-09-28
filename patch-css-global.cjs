// patch-css-global.cjs
// Quét toàn bộ node_modules (/*.js, .mjs, .cjs) và comment mọi dòng import/export chứa ".css"
// Lưu ý: script chỉ comment dòng (thêm // trước dòng), an toàn để revert.

const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(root)) {
  console.error('node_modules not found in', process.cwd());
  process.exit(1);
}

const exts = ['.js','.mjs','.cjs'];
const hits = [];

function walk(dir){
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of list){
    const fp = path.join(dir, e.name);
    try{
      if (e.isDirectory()){
        // skip common heavy folders to speed up (optional)
        if (['.bin','@types','dist'].includes(e.name)) {
          walk(fp);
        } else {
          walk(fp);
        }
      } else if (e.isFile() && exts.includes(path.extname(e.name))){
        let s = fs.readFileSync(fp, 'utf8');
        // if file already contains .css anywhere
        if (s.indexOf('.css') === -1) continue;
        const lines = s.split(/\r?\n/);
        let changed = false;
        for (let i=0;i<lines.length;i++){
          const t = lines[i].trim();
          // match imports/exports that reference .css OR dynamic import('...css') on a line
          if (t.match(/(^\/\/|^\/\*)/)) continue; // skip already commented or block comment start
          if (t.match(/(^import\s+.*\.css\b)|(\.css\b.*from\s+)|(^export\s+.*from\s+['"].+\.css['"])/i)
          {
            // comment the line
            lines[i] = '// ' + lines[i];
            changed = true;
            hits.push(fp + ':' + (i+1));
          } else if (t.match(/import\(['"].+\.css['"]\)/i) || t.match(/from\s+['"].+\.css['"]/i)) {
            // other forms (dynamic import, from '...css')
            lines[i] = '// ' + lines[i];
            changed = true;
            hits.push(fp + ':' + (i+1));
          }
        }
        if (changed){
          fs.writeFileSync(fp, lines.join('\n'), 'utf8');
          console.log('Patched file:', fp);
        }
      }
    }catch(err){
      // ignore unreadable files
    }
  }
}

console.log('Scanning node_modules (this may take a little while)...');
walk(root);
console.log('Done. Found and commented', hits.length, 'lines (examples):');
console.log(hits.slice(0,20).join('\n'));
