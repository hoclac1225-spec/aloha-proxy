// check-json.js
import fs from 'fs';
import path from 'path';

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (file.endsWith('.json')) {
      try {
        const content = fs.readFileSync(full, 'utf8');
        // kiﬂ+‚m tra k++ tﬂ+¶ export/comment
        if (/export|\/\/|\/\*/.test(content)) {
          console.warn('[POTENTIAL ISSUE] JS syntax in JSON:', full);
        }
        JSON.parse(content); // kiﬂ+‚m tra thuﬂ¶∫n JSON
      } catch (e) {
        console.error('[INVALID JSON]', full, e.message);
      }
    }
  }
}

walk('./app'); // -Êﬂ+Úi ./app th+·nh th¶¶ mﬂ+—c repo
