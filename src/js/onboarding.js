// src/js/onboarding.js
// Client-side onboarding helper. Always normalizes errors/returns.

import { callAPI } from "./api.js";

/* Validate minimal user fields */
function validateUser(user) {
  if (!user || typeof user !== "object") return "Invalid user data";
  if (!user.name || String(user.name).trim().length < 2) return "Name is required";
  if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) return "Valid email is required";
  return null;
}

/* Minimal notification helpers */
function showNotification(message, type = "info") {
  try {
    const el = document.createElement("div");
    el.textContent = message;
    el.style = "position:fixed;right:16px;top:16px;padding:8px 12px;border-radius:8px;z-index:99999;background:#111;color:#fff;font-size:13px;";
    if (type === "error") el.style.background = "#b91c1c";
    if (type === "success") el.style.background = "#059669";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  } catch (e) {}
}

function showLoading(show = true) {
  try {
    let overlay = document.getElementById("onboarding-loading-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "onboarding-loading-overlay";
      Object.assign(overlay.style, {
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.25)",
        zIndex: 99998,
      });
      const spinner = document.createElement("div");
      spinner.textContent = "Loading...";
      Object.assign(spinner.style, { background: "#fff", padding: "12px 18px", borderRadius: "8px" });
      overlay.appendChild(spinner);
      document.body.appendChild(overlay);
    }
    overlay.style.display = show ? "flex" : "none";
  } catch (e) {}
}

/* Make sure unhandled rejections are logged as Error */
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (ev) => {
    try {
      console.error("Unhandled promise rejection (onboarding):", ev.reason);
    } catch (e) {}
  });
}

/**
 * startOnboarding
 * @param {Object} userData - { name, email, phone?, payload? }
 * @param {string} endpoint - default "/api/onboard" or full url
 * @returns {Promise<Object>} normalized response object
 */
export async function startOnboarding(userData, endpoint = "/api/onboard") {
  // normalize userData
  const user = userData && typeof userData === "object" ? { ...userData } : {};
  const v = validateUser(user);
  if (v) {
    showNotification(v, "error");
    return { ok: false, error: v };
  }

  // ensure payload exists (Prisma requires payload non-nullable in your schema)
  if (user.payload == null) user.payload = {};

  // resolve endpoint: use window.SHOPIFY_APP_URL if present to build absolute path
  let resolved = endpoint;
  if (typeof window !== "undefined" && window.SHOPIFY_APP_URL && !/^https?:\/\//i.test(endpoint)) {
    resolved = window.SHOPIFY_APP_URL.replace(/\/$/, "") + endpoint;
  }

  showLoading(true);
  try {
    const res = await callAPI(resolved, "POST", user, { timeoutMs: 20000 });
    showLoading(false);

    if (!res || typeof res !== "object") {
      const msg = "Invalid response from server";
      showNotification(msg, "error");
      return { ok: false, error: msg, raw: res };
    }

    if (res.ok === true || res.ok === undefined && res.status === 200) {
      showNotification("Onboarding succeeded", "success");
    } else {
      const errMsg = res.error || res.message || `HTTP ${res.status || "?"}`;
      showNotification(errMsg, "error");
    }
    return res;
  } catch (err) {
    showLoading(false);
    const message = err instanceof Error ? err.message : String(err || "Unknown error");
    showNotification(message, "error");
    return { ok: false, error: message };
  }
}
