import fs from "fs";
import stripBom from "strip-bom";

const filePath = "./app/locales/en.json";
const content = fs.readFileSync(filePath, "utf8");
const cleaned = stripBom(content);

try {
  JSON.parse(cleaned);
  console.log(`${filePath} OK, no BOM issues`);
} catch (e) {
  console.error(`${filePath} JSON parse ERROR:`, e.message);
}
