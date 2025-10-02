/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  globals: {
    shopify: "readonly",
  },
  rules: {
    // Thêm các rule tuỳ chỉnh nếu muốn
  },
};
