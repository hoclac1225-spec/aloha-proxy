const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'app/locales');

fs.readdirSync(localesDir).forEach(file => {
  const fullPath = path.join(localesDir, file);
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    JSON.parse(content);
    console.log('[VALID] ', file);
  } catch (err) {
    console.error('[INVALID] ', file, err.message);
    process.exit(1); // stop build nếu có lỗi
  }
});
