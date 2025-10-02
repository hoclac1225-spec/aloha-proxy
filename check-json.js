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
        // kiß╗âm tra k├╜ tß╗▒ export/comment
        if (/export|\/\/|\/\*/.test(content)) {
          console.warn('[POTENTIAL ISSUE] JS syntax in JSON:', full);
        }
        JSON.parse(content); // kiß╗âm tra thuß║ºn JSON
      } catch (e) {
        console.error('[INVALID JSON]', full, e.message);
      }
    }
  }
}

walk('./app'); // ─æß╗òi ./app th├ánh th╞░ mß╗Ñc repo

