// src/js/onboarding.js
// Minimal, robust client onboarding helper (no JSX, no weird chars)

import { callAPI } from "./api.js";
import { validateUser } from "./validation.js";

export function showNotification(message, type = "info") {
  try {
    const notif = document.createElement("div");
    notif.className = `onboarding-notif onboarding-${type}`;
    notif.textContent = String(message || "");
    // Minimal inline styles so it always shows
    notif.style.position = "fixed";
    notif.style.right = "16px";
    notif.style.top = "16px";
    notif.style.zIndex = "99999";
    notif.style.padding = "8px 12px";
    notif.style.borderRadius = "8px";
    notif.style.color = "#fff";
    notif.style.fontFamily = "system-ui, Arial, sans-serif";
    notif.style.fontSize = "13px";
    notif.style.maxWidth = "360px";
    notif.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)";

    if (type === "success") notif.style.background = "#16a34a";
    else if (type === "error") notif.style.background = "#dc2626";
    else notif.style.background = "#0ea5e9";

    document.body.appendChild(notif);
    setTimeout(() => {
      try { notif.remove(); } catch (e) {}
    }, 4000);
  } catch (e) {
    // fallback
    // eslint-disable-next-line no-console
    console.warn("showNotification fallback:", message, e);
  }
}

export function showLoading(show = true) {
  try {
    let overlay = document.getElementById("onboarding-loading-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "onboarding-loading-overlay";
      overlay.style.position = "fixed";
      overlay.style.left = "0";
      overlay.style.top = "0";
      overlay.style.right = "0";
      overlay.style.bottom = "0";
      overlay.style.display = "none";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.background = "rgba(0,0,0,0.35)";
      overlay.style.zIndex = "99998";

      const spinner = document.createElement("div");
      spinner.style.width = "44px";
      spinner.style.height = "44px";
      spinner.style.border = "6px solid rgba(255,255,255,0.2)";
      spinner.style.borderTopColor = "#fff";
      spinner.style.borderRadius = "50%";
      spinner.style.animation = "onboarding-spin 1s linear infinite";

      // inject simple keyframes if missing
      if (!document.getElementById("onboarding-spinner-style")) {
        const s = document.createElement("style");
        s.id = "onboarding-spinner-style";
        s.textContent = "@keyframes onboarding-spin { to { transform: rotate(360deg); } }";
        document.head.appendChild(s);
      }

      overlay.appendChild(spinner);
      document.body.appendChild(overlay);
    }

    overlay.style.display = show ? "flex" : "none";
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("showLoading fallback:", e);
  }
}

/**
 * startOnboarding
 * - validateUser must be present in ./validation.js
 * - uses callAPI from ./api.js
 * - ensures payload exists
 */
export async function startOnboarding(userData, endpointOrBase = "/api/onboard") {
  // lightweight guard
  if (!userData || typeof userData !== "object") {
    showNotification("Invalid user data", "error");
    return { success: false, error: "Invalid userData" };
  }

  try {
    const validationError = validateUser ? validateUser(userData) : null;
    if (validationError) {
      showNotification(validationError, "error");
      return { success: false, error: validationError };
    }
  } catch (e) {
    console.error("[onboarding] validateUser threw", e);
    showNotification("Validation error", "error");
    return { success: false, error: e && e.message ? e.message : String(e) };
  }

  // ensure payload exists so Prisma required field isn't missing
  if (userData.payload === undefined || userData.payload === null) {
    userData.payload = {};
  }

  // resolve endpoint simply
  const runtimeBase = (typeof window !== "undefined" && window.SHOPIFY_APP_URL)
    ? String(window.SHOPIFY_APP_URL).replace(/\/+$/, "")
    : null;

  const endpoint = (typeof endpointOrBase === "string" && endpointOrBase.startsWith("http"))
    ? endpointOrBase
    : runtimeBase ? runtimeBase + endpointOrBase : endpointOrBase;

  if (!endpoint || typeof endpoint !== "string") {
    const msg = "Invalid endpoint resolved: " + String(endpoint);
    showNotification(msg, "error");
    return { success: false, error: msg };
  }

  showLoading(true);
  try {
    const resp = await callAPI(endpoint, "POST", userData, { asFormData: true, timeoutMs: 20000 });
    showLoading(false);

    if (!resp || typeof resp !== "object") {
      showNotification("Invalid server response", "error");
      return { success: false, error: "Invalid server response", raw: resp };
    }

    if (resp.ok) {
      showNotification("Onboarding successful", "success");
    } else {
      const errMsg = (resp.data && (resp.data.error || resp.data.message)) || resp.error || `Status ${resp.status}`;
      showNotification(errMsg, "error");
    }

    return resp;
  } catch (err) {
    showLoading(false);
    const msg = err && err.message ? err.message : String(err || "Unknown error");
    console.error("[onboarding] exception:", err);
    showNotification(msg, "error");
    return { success: false, error: msg };
  }
}
