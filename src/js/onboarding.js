// onboarding.js
// Hoàn chỉnh - includes showNotification, showLoading, and hardened startOnboarding
// Usage: import { startOnboarding, showNotification, showLoading } from './onboarding.js';

import { callAPI } from "./api.js";
import { validateUser } from "./validation.js";

/**
 * showNotification(message, type)
 * type: "info" | "success" | "error"
 */
export function showNotification(message, type = "info") {
  try {
    const notif = document.createElement("div");
    notif.className = `onboarding-notif onboarding-${type}`;
    notif.textContent = message || String(message);

    // minimal inline styling so notification shows even without CSS
    notif.style.position = "fixed";
    notif.style.right = "20px";
    notif.style.top = "20px";
    notif.style.zIndex = 99999;
    notif.style.padding = "10px 14px";
    notif.style.borderRadius = "8px";
    notif.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
    notif.style.fontFamily = "system-ui,Segoe UI,Roboto,'Helvetica Neue',Arial";
    notif.style.fontSize = "13px";
    notif.style.color = "#fff";
    notif.style.maxWidth = "320px";
    notif.style.wordBreak = "break-word";

    if (type === "success") notif.style.background = "#16a34a";
    else if (type === "error") notif.style.background = "#dc2626";
    else notif.style.background = "#0ea5e9";

    document.body.appendChild(notif);
    setTimeout(() => {
      try { notif.remove(); } catch (e) {}
    }, 4000);
  } catch (e) {
    // fallback to console
    console.warn("showNotification fallback:", message, e);
  }
}

/**
 * showLoading(show = true)
 * lightweight overlay spinner
 */
export function showLoading(show = true) {
  try {
    let overlay = document.getElementById("onboarding-loading-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "onboarding-loading-overlay";
      overlay.style.position = "fixed";
      overlay.style.left = 0;
      overlay.style.top = 0;
      overlay.style.right = 0;
      overlay.style.bottom = 0;
      overlay.style.display = "none";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.background = "rgba(0,0,0,0.35)";
      overlay.style.zIndex = 99998;

      const spinner = document.createElement("div");
      spinner.className = "onboarding-spinner";
      spinner.style.width = "48px";
      spinner.style.height = "48px";
      spinner.style.border = "6px solid rgba(255,255,255,0.25)";
      spinner.style.borderTopColor = "#ffffff";
      spinner.style.borderRadius = "50%";
      spinner.style.animation = "onboarding-spin 1s linear infinite";

      // inject keyframes once
      if (!document.getElementById("onboarding-spinner-style")) {
        const styleEl = document.createElement("style");
        styleEl.id = "onboarding-spinner-style";
        styleEl.textContent = `
@keyframes onboarding-spin { to { transform: rotate(360deg); } }
`;
        document.head.appendChild(styleEl);
      }

      overlay.appendChild(spinner);
      document.body.appendChild(overlay);
    }
    overlay.style.display = show ? "flex" : "none";
  } catch (e) {
    console.warn("showLoading fallback:", e);
  }
}

/**
 * startOnboarding(userData, endpointOrBase)
 * - validate user data
 * - ensure payload exists (DB requires payload)
 * - send as FormData to be compatible with current server
 * - return normalized response object { ok, status, data, error, rawText }
 */
export async function startOnboarding(userData, endpointOrBase = "/api/onboard") {
  console.log("[onboarding] startOnboarding called with:", userData);

  // Basic validation via external validator
  try {
    const validationError = validateUser(userData);
    if (validationError) {
      showNotification(validationError, "error");
      console.warn("[onboarding] Validation failed:", validationError);
      return { success: false, error: validationError };
    }
  } catch (e) {
    // if validateUser throws unexpectedly, surface error
    console.error("[onboarding] validateUser threw:", e);
    showNotification("Validation error", "error");
    return { success: false, error: e && e.message ? e.message : String(e) };
  }

  // Resolve endpoint (support runtime base)
  const runtimeBase =
    typeof window !== "undefined" && window.SHOPIFY_APP_URL
      ? window.SHOPIFY_APP_URL.replace(/\/+$/, "")
      : null;

  const endpoint = endpointOrBase && endpointOrBase.startsWith && endpointOrBase.startsWith("http")
    ? endpointOrBase
    : runtimeBase
      ? runtimeBase + endpointOrBase
      : endpointOrBase;

  console.log("[onboarding] resolved endpoint:", endpoint);

  if (!endpoint || typeof endpoint !== "string") {
    const errMsg = "Invalid endpoint resolved for onboarding: " + String(endpoint);
    console.error("[onboarding]", errMsg);
    showNotification(errMsg, "error");
    return { success: false, error: errMsg };
  }

  // Ensure payload exists (server/DB expects payload field)
  if (!userData.payload) {
    // set empty object if missing
    userData.payload = {};
  }

  // Optional: minimize sensitive data in logs
  const preview = Object.assign({}, userData);
  if (preview.password) preview.password = "***";
  try {
    if (preview.payload && typeof preview.payload === "object") {
      // avoid huge logs
      preview.payload = "[object payload]";
    }
  } catch (e) {}

  console.log("[onboarding] payload-prepared preview:", preview);

  showLoading(true);
  try {
    let response;
    try {
      // send as FormData because server expects multipart/form-data
      response = await callAPI(endpoint, "POST", userData, { asFormData: true, timeoutMs: 20000 });
    } catch (innerErr) {
      console.error("[onboarding] callAPI threw:", innerErr);
      const message = innerErr && innerErr.message ? innerErr.message : String(innerErr || "callAPI error");
      showLoading(false);
      showNotification(message, "error");
      return { success: false, error: message };
    }

    showLoading(false);
    console.log("[onboarding] API response (raw):", response);

    if (!response || typeof response !== "object") {
      const msg = "Invalid response from server (not an object)";
      console.error("[onboarding]", msg, response);
      showNotification(msg, "error");
      return { success: false, error: msg, raw: response };
    }

    // Normalized response shape: { ok, status, data, error, rawText }
    if (response.ok === true) {
      showNotification("Onboarding successful!", "success");
      console.info("[onboarding] completed successfully.");
    } else {
      const errMsg =
        (response.data && (response.data.error || response.data.message || response.data.msg)) ||
        response.error ||
        `Onboarding failed (status ${response.status})`;
      showNotification(errMsg, "error");
      console.warn("[onboarding] Onboarding failed:", response);
    }

    return response;
  } catch (err) {
    showLoading(false);
    console.error("[onboarding] Unexpected exception:", err);
    const msg = err && err.message ? err.message : String(err || "Unknown error");
    showNotification(msg, "error");
    return { success: false, error: msg };
  }
}
