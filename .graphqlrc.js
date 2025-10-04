import fs from "fs";
import { ApiVersion } from "@shopify/shopify-api";
import { shopifyApiProject, ApiType } from "@shopify/api-codegen-preset";

/**
 * Táº¡o cáº¥u hÃ¬nh GraphQL Codegen cho app vÃ  cÃ¡c extension.
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

  // Kiá»ƒm tra cÃ¡c extension
  let extensions = [];
  try {
    extensions = fs.readdirSync("./extensions");
  } catch {
    // Bá» qua náº¿u thÆ° má»¥c extensions khÃ´ng tá»“n táº¡i
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
