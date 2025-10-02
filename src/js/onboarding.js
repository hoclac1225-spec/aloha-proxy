// src/js/onboarding.js
// Defensive client onboarding logic.
// All errors are caught/logged; ensures payload exists.

import { callAPI } from "./api.js";

function isEmail(s) {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function notify(msg, type = "info") {
  // simple non-fatal notifier
  try {
    console[type === "error" ? "error" : "log"]("[onboarding] " + msg);
    if (typeof document !== "undefined") {
      const el = document.createElement("div");
      el.textContent = msg;
      el.style = "position:fixed;right:12px;top:12px;padding:6px 10px;border-radius:6px;background:#111;color:#fff;z-index:99999;font-size:12px";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }
  } catch (e) {}
}

export async function startOnboarding(user = {}, endpoint = "/api/onboard") {
  // defend: ensure object
  try {
    if (!user || typeof user !== "object") throw new Error("Invalid user input");
    if (!user.name || String(user.name).trim().length < 2) throw new Error("Name required");
    if (!isEmail(user.email)) throw new Error("Valid email required");

    // Ensure payload exists (Prisma expects payload property)
    if (user.payload == null) user.payload = {};

    // Build absolute URL when window.SHOPIFY_APP_URL is present
    if (typeof window !== "undefined" && window.SHOPIFY_APP_URL && !/^https?:\/\//i.test(endpoint)) {
      endpoint = window.SHOPIFY_APP_URL.replace(/\/$/, "") + endpoint;
    }

    const result = await callAPI(endpoint, "POST", user, { timeoutMs: 20000 });

    // result should be an object; always safe-check
    if (!result || typeof result !== "object") {
      const msg = "Invalid server response";
      notify(msg, "error");
      return { ok: false, error: msg, raw: result };
    }

    if (!result.ok) {
      const em = result.error || result.message || `HTTP ${result.status || "?"}`;
      notify("Onboard failed: " + em, "error");
      return { ok: false, error: em, raw: result };
    }

    notify("Onboard success", "success");
    return { ok: true, data: result.data ?? result };
  } catch (err) {
    // ALWAYS log full Error with stack to console
    const message = err instanceof Error ? (err.message || String(err)) : String(err);
    console.error("startOnboarding caught:", err && err.stack ? err.stack : err);
    notify("Error: " + message, "error");
    // rethrow so calling code can handle, but preserve Error object
    throw err instanceof Error ? err : new Error(message);
  }
}
