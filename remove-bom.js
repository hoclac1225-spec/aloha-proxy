const fs = require('fs');
const path = require('path');

// ÄÆ°á»ng dáº«n tá»›i CSS Polaris
const file = path.join('node_modules', '@shopify', 'polaris', 'build', 'esm', 'styles.css');

if (!fs.existsSync(file)) {
  console.error('File khÃ´ng tá»“n táº¡i:', file);
  process.exit(1);
}

let content = fs.readFileSync(file, 'utf8');
content = content.replace(/^\uFEFF/, ''); // XÃ³a kÃ½ tá»± BOM
fs.writeFileSync(file, content, 'utf8');
console.log('ÄÃ£ xÃ³a BOM khá»i styles.css');
