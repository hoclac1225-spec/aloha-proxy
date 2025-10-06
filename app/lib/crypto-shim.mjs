// lib/crypto-shim.mjs
import { webcrypto } from "crypto";
import { setCrypto } from "@shopify/cli-kit/node/runtime";

setCrypto(webcrypto);
