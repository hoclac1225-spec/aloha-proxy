// lib/shopify-setup.mjs
import { webcrypto } from "crypto";
import { setCrypto } from "@shopify/cli-kit/node/runtime";

// Bắt buộc phải gọi setCrypto trước khi import Shopify API
setCrypto(webcrypto);

import { Shopify } from "@shopify/shopify-api";

// Export để các file khác import
export { Shopify };
