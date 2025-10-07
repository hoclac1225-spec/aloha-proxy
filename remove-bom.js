const fs = require('fs');
const path = require('path');

// Đường dẫn tới CSS Polaris
const file = path.join('node_modules', '@shopify', 'polaris', 'build', 'esm', 'styles.css');

if (!fs.existsSync(file)) {
  console.error('File không tồn tại:', file);
  process.exit(1);
}

let content = fs.readFileSync(file, 'utf8');
content = content.replace(/^\uFEFF/, ''); // Xóa ký tự BOM
fs.writeFileSync(file, content, 'utf8');
console.log('Đã xóa BOM khỏi styles.css');
