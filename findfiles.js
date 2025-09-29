// findfiles.js
const fs = require('fs'), path = require('path');
const hits = [];
function walk(dir){
  try{
    fs.readdirSync(dir).forEach(f=>{
      const fp = path.join(dir,f);
      const s = fs.statSync(fp);
      if (s.isDirectory()) walk(fp);
      else if (fp.endsWith('.mjs')||fp.endsWith('.js')||fp.endsWith('.cjs')){
        const c = fs.readFileSync(fp,'utf8');
        if (c.includes("assert { type: 'json' }")) hits.push(fp);
      }
    });
  }catch(e){}
}
walk('node_modules');
if (hits.length) console.log('FOUND\n' + hits.join('\n')); else console.log('NOT FOUND');
