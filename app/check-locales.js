// check-locales.js (Ä‘áº·t táº¡i root)
const fs = require('fs');
const path = require('path');

function checkJSON(dir) {
  if (!fs.existsSync(dir)) {
    console.error('[ERROR] Directory not found:', dir);
    process.exit(2);
  }
  const items = fs.readdirSync(dir);
  items.forEach(name => {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      checkJSON(full);
    } else if (name.endsWith('.json')) {
      try {
        const content = fs.readFileSync(full, 'utf8');
        JSON.parse(content);
        console.log('[OK]    ', full);
      } catch (e) {
        console.error('[INVALID]', full);
        console.error('         ', e.message);
      }
    }
  });
}

checkJSON(path.join(__dirname, 'app', 'locales'));
