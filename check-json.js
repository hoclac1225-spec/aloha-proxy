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
        // kiểm tra ký tự export/comment
        if (/export|\/\/|\/\*/.test(content)) {
          console.warn('[POTENTIAL ISSUE] JS syntax in JSON:', full);
        }
        JSON.parse(content); // kiểm tra thuần JSON
      } catch (e) {
        console.error('[INVALID JSON]', full, e.message);
      }
    }
  }
}

<<<<<<< HEAD
walk('./app'); // đổi ./app thành thư mục repo
=======
walk('./app'); // đổi ./app thành thư mục repo
>>>>>>> 05f94a6 (Commit all local changes)
