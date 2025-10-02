// check-locales.mjs
import fs from 'fs';
import path from 'path';

function checkJSON(dir){
  if(!fs.existsSync(dir)){ console.error('Not found', dir); process.exit(2); }
  const items = fs.readdirSync(dir);
  for(const name of items){
    const full = path.join(dir, name);
    if(fs.statSync(full).isDirectory()) checkJSON(full);
    else if(name.endsWith('.json')){
      try{
        const s = fs.readFileSync(full,'utf8');
        JSON.parse(s);
        console.log('[OK]    ', full);
      }catch(e){
        console.error('[INVALID]', full);
        console.error('         ', e.message);
      }
    }
  }
}
checkJSON(path.join(process.cwd(),'app','locales'));
