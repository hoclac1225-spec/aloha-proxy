import React from 'react';
import AppBridgePkg from "@shopify/app-bridge-react";

const AppBridge = (AppBridgePkg && (AppBridgePkg.default || AppBridgePkg)) || {};
const AppBridgeProvider = AppBridge.Provider || AppBridge.AppBridgeProvider || null;

import ReactDOM from 'react-dom/client';
import { AppProvider } from '@shopify/polaris';

import App from './App';
import '@shopify/polaris/build/esm/styles.css';

const appBridgeConfig = {
  apiKey: process.env.SHOPIFY_API_KEY || 'YOUR_SHOPIFY_API_KEY',
  host: typeof window !== 'undefined' ? new URL(window.location.href).searchParams.get('host') : undefined,
  forceRedirect: true,
};

if (typeof document !== 'undefined') {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <AppBridgeProvider config={appBridgeConfig}>
      <AppProvider>
        <App />
      </AppProvider>
    </AppBridgeProvider>
  );
}
