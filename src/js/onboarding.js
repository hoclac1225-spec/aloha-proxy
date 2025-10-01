// src/js/onboarding.js
import { callAPI } from "./api.js";
import { validateUser } from "./validation.js";

export function showNotification(message, type = "info") {
  try {
    const notif = document.createElement("div");
    notif.className = `onboarding-notif onboarding-${type}`;
    notif.textContent = String(message || "");
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
    console.warn("showLoading fallback:", e);
  }
}

export async function startOnboarding(userData, endpointOrBase = "/api/onboard") {
  console.log("[onboarding] startOnboarding called with:", userData);

  if (!userData || typeof userData !== "object") {
    const msg = "Invalid userData provided to startOnboarding";
    showNotification(msg, "error");
    console.warn("[onboarding]", msg);
    return { success: false, error: msg };
  }

  // validate
  let validationError = null;
  try {
    validationError = typeof validateUser === "function" ? validateUser(userData) : null;
  } catch (e) {
    console.error("[onboarding] validateUser threw:", e);
    validationError = e && e.message ? e.message : String(e);
  }

  if (validationError) {
    showNotification(validationError, "error");
    console.warn("[onboarding] Validation failed:", validationError);
    return { success: false, error: validationError };
  }

  // ensure payload exists (prevents prisma missing required payload)
  if (userData.payload === undefined || userData.payload === null) {
    userData.payload = {};
  }

  const runtimeBase = (typeof window !== "undefined" && window.SHOPIFY_APP_URL)
    ? String(window.SHOPIFY_APP_URL).replace(/\/+$/, "")
    : null;

  const endpoint = (typeof endpointOrBase === "string" && endpointOrBase.startsWith("http"))
    ? endpointOrBase
    : runtimeBase ? runtimeBase + endpointOrBase : endpointOrBase;

  console.log("[onboarding] resolved endpoint:", endpoint);

  if (!endpoint || typeof endpoint !== "string") {
    const errMsg = "Invalid endpoint resolved for onboarding: " + String(endpoint);
    console.error("[onboarding]", errMsg);
    showNotification(errMsg, "error");
    return { success: false, error: errMsg };
  }

  showLoading(true);
  try {
    let response;
    try {
      response = await callAPI(endpoint, "POST", userData, { timeoutMs: 20000 });
    } catch (innerErr) {
      // normalize thrown value
      const message = innerErr && innerErr.message ? innerErr.message : String(innerErr || "callAPI error");
      console.error("[onboarding] callAPI threw:", innerErr);
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

    if (response.ok === true) {
      showNotification("Onboarding successful!", "success");
      console.info("[onboarding] Onboarding completed successfully.");
    } else {
      const errMsg = (response.error || (response.data && (response.data.error || response.data.message)) || "Onboarding failed");
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
