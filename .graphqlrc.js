import fs from "fs";
import { ApiVersion } from "@shopify/shopify-api";
import { shopifyApiProject, ApiType } from "@shopify/api-codegen-preset";

/**
 * Tạo cấu hình GraphQL Codegen cho app và các extension.
 */
function getConfig() {
  const config = {
    projects: {
      default: shopifyApiProject({
        apiType: ApiType.Admin,
        apiVersion: ApiVersion.July25,
        documents: [
          "./app/**/*.{js,ts,jsx,tsx}",
          "./app/.server/**/*.{js,ts,jsx,tsx}",
        ],
        outputDir: "./app/types",
      }),
    },
  };

  // Kiểm tra các extension
  let extensions = [];
  try {
    extensions = fs.readdirSync("./extensions");
  } catch {
    // Bỏ qua nếu thư mục extensions không tồn tại
  }

  for (const entry of extensions) {
    const extensionPath = `./extensions/${entry}`;
    const schema = `${extensionPath}/schema.graphql`;

    if (!fs.existsSync(schema)) continue;

    config.projects[entry] = {
      schema,
      documents: [`${extensionPath}/**/*.graphql`],
    };
  }

  return config;
}

const config = getConfig();
export default config;
