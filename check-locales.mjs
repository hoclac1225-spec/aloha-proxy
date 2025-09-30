// check-locales-debug.mjs
import fs from 'fs';
import path from 'path';

function showInfo(full) {
  const b = fs.readFileSync(full);
  const s = b.toString('utf8');
  console.log('[FILE]', full);
  console.log('  size:', b.length);
  console.log('  first-200:', s.slice(0,200).replace(/\r\n/g,'\\r\\n'));
  console.log('  includes "export ":', s.includes('export '));
  console.log('  hex-head (first 80 bytes):', b.slice(0,80).toString('hex'));
  try {
    JSON.parse(s);
    console.log('  JSON.parse: OK');
  } catch(e) {
    console.error('  JSON.parse: ERR', e.message);
  }
}

function checkJSON(dir){
  if(!fs.existsSync(dir)){
    console.error('[ERROR] Locales directory not found:', dir);
    process.exit(2);
  }
  const items = fs.readdirSync(dir);
  for(const name of items){
    const full = path.join(dir, name);
    if(fs.statSync(full).isDirectory()){
      checkJSON(full);
    } else if(name.endsWith('.json')){
      showInfo(full);
    }
  }
}

checkJSON(path.join(process.cwd(),'app','locales'));
