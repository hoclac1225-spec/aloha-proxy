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
import { en } from "./locales/en"; // import file en.js

export const loader = async () => {
  const SHOPIFY_APP_URL = process.env.SHOPIFY_APP_URL ?? "";
  return json({ SHOPIFY_APP_URL });
};

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
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
          crossOrigin="anonymous"
        />
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
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
