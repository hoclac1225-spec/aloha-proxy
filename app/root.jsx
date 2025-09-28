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

/**
 * Loader trả SHOPIFY_APP_URL từ process.env (server runtime).
 * Điều này giúp SSR in giá trị đúng và tránh hydration mismatch.
 */
export const loader = async () => {
  const SHOPIFY_APP_URL = process.env.SHOPIFY_APP_URL ?? "";
  return json({ SHOPIFY_APP_URL });
};

/**
 * Content Security Policy rõ ràng (cập nhật để bao gồm font-src).
 * Bạn có thể điều chỉnh domain ngrok nếu cần; wildcard https://*.ngrok-free.app
 */
export const headers = () => {
  const csp =
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com https://*.ngrok-free.app; " +
    "style-src 'self' 'unsafe-inline' https://cdn.shopify.com https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com https://cdn.shopify.com data:; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.ngrok-free.app https://api.shopify.com http://127.0.0.1:* ws://127.0.0.1:*; " +
    "frame-ancestors 'self' https://admin.shopify.com; " +
    "base-uri 'self'; form-action 'self';";
  return {
    "Content-Security-Policy": csp,
  };
};

export default function App() {
  const data = useLoaderData();
  const shopifyAppUrl = (data && data.SHOPIFY_APP_URL) || "";

  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <Meta />
        <Links />

        {/* Preconnect / fonts */}
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
          crossOrigin="anonymous"
        />

        {/* In giá trị SHOPIFY_APP_URL ở server (JSON.stringify để an toàn) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.SHOPIFY_APP_URL = ${JSON.stringify(shopifyAppUrl)};`,
          }}
        />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
