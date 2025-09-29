// app/root.jsx
import React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { AppProvider } from "@shopify/polaris";
import { en } from "./locales/en"; // named export en

export const loader = async () => {
  const SHOPIFY_APP_URL = process.env.SHOPIFY_APP_URL ?? "https://aloha-proxy.onrender.com";
  return json({ SHOPIFY_APP_URL, NODE_ENV: process.env.NODE_ENV ?? "development" });
};

export const headers = ({ loaderHeaders }) => {
  // Lấy NODE_ENV nếu cần (Remix loader có thể trả về, ở đây simple)
  const cspBase =
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://cdn.shopify.com https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com https://cdn.shopify.com data:; " +
    "img-src 'self' data: https:; " +
    "frame-ancestors 'self' https://admin.shopify.com; " +
    "base-uri 'self'; form-action 'self';";

  // Lưu ý: tránh 'unsafe-eval' và 'unsafe-inline' ở production nếu có thể.
  // Nếu đang dev và cần vite HMR, có thể tạm cho phép (vì build production không cần).
  const devExtras = "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com; connect-src 'self' https://api.shopify.com ws://127.0.0.1:*;";
  const prodExtras = "script-src 'self' https://cdn.shopify.com; connect-src 'self' https://api.shopify.com;";

  // Bạn có thể thay NODE_ENV check bằng biến loader nếu muốn.
  const isDev = process.env.NODE_ENV !== "production";
  const csp = cspBase + (isDev ? devExtras : prodExtras);

  return { "Content-Security-Policy": csp };
};

export default function App() {
  const data = useLoaderData();
  const shopifyAppUrl = data?.SHOPIFY_APP_URL ?? "https://aloha-proxy.onrender.com";

  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css" crossOrigin="anonymous" />
        {/* Gán biến toàn cục an toàn */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.SHOPIFY_APP_URL = ${JSON.stringify(shopifyAppUrl)};`,
          }}
        />
      </head>
      <body>
        <AppProvider i18n={en.Polaris}>
          <Outlet />
        </AppProvider>
        <noscript>
          <div style={{ padding: 16 }}>Vui lòng bật JavaScript để sử dụng ứng dụng này.</div>
        </noscript>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
