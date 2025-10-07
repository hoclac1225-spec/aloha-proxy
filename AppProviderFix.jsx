import React from "react";

/* ✅ Safe import: tương thích cả CJS và ESM */
import AppBridgePkg from "@shopify/app-bridge-react";
const AppBridge =
  AppBridgePkg?.default || AppBridgePkg || {};
const AppBridgeProvider =
  AppBridge.Provider ||
  AppBridge.AppBridgeProvider ||
  null;

/* ✅ Polaris provider & i18n */
import { AppProvider } from "@shopify/polaris";
import { enTranslations } from "./polarisTranslations";

export function AppProviderFix({ children }) {
  // ✅ cấu hình App Bridge
  const config = {
    apiKey: import.meta?.env?.VITE_SHOPIFY_API_KEY || process.env.SHOPIFY_API_KEY || "dummy-key",
    shopOrigin: import.meta?.env?.VITE_SHOPIFY_SHOP || process.env.SHOPIFY_SHOP || "dummy.myshopify.com",
    forceRedirect: true,
  };

  // ✅ fallback nếu AppBridgeProvider không có
  if (!AppBridgeProvider) {
    console.warn("⚠️ AppBridgeProvider not found, falling back to Polaris only.");
    return <AppProvider i18n={enTranslations}>{children}</AppProvider>;
  }

  return (
    <AppBridgeProvider config={config}>
      <AppProvider i18n={enTranslations}>{children}</AppProvider>
    </AppBridgeProvider>
  );
}
