// src/js/onboarding.js
// Onboarding client logic with local validation and robust error handling.

import { callAPI } from "./api.js";

/* Simple validator (self-contained) */
function validateUser(user) {
  if (!user || typeof user !== "object") return "Invalid user data";
  if (!user.name || String(user.name).trim().length < 2) return "Name is required";
  if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) return "Valid email is required";
  return null;
}

/* Lightweight UI helpers (replace with your real ones if present) */
function showNotification(message, type = "info") {
  try {
    const el = document.createElement("div");
    el.className = `onboarding-notif onboarding-${type}`;
    el.textContent = message;
    Object.assign(el.style, {
      position: "fixed",
      right: "16px",
      top: type === "error" ? "16px" : "80px",
      background: "#111",
      color: "#fff",
      padding: "8px 12px",
      borderRadius: "6px",
      zIndex: 99999,
      opacity: 0.95,
      fontSize: "13px",
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  } catch (e) {
    // ignore UI errors
    // console.warn("showNotification failed", e);
  }
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

/* Global handler to capture "Uncaught (in promise) undefined" style errors */
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (ev) => {
    console.error("Global unhandledrejection captured:", ev.reason);
    // optional quick visual flag during dev:
    // showNotification(`Unhandled rejection: ${String(ev.reason)}`, "error");
  });
}

/**
 * Start onboarding process
 * @param {Object} userData - { name, email, phone?, payload? }
 * @param {string} endpointOrBase - default "/api/onboard" or full URL
 */
export async function startOnboarding(userData, endpointOrBase = "/api/onboard") {
  console.log("[onboarding] startOnboarding called with:", userData);

  const validationError = validateUser(userData);
  if (validationError) {
    showNotification(validationError, "error");
    console.warn("[onboarding] Validation failed:", validationError);
    return { success: false, error: validationError };
  }

  // Ensure payload exists (server expects JSON)
  const bodyToSend = { ...userData };
  if (bodyToSend.payload == null) bodyToSend.payload = {};

  // Resolve endpoint
  const runtimeBase =
    typeof window !== "undefined" && window.SHOPIFY_APP_URL ? window.SHOPIFY_APP_URL.replace(/\/+$/, "") : null;

  const endpoint =
    endpointOrBase && typeof endpointOrBase === "string" && endpointOrBase.startsWith("http")
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

  showLoading(true);

  try {
    let response;
    try {
      response = await callAPI(endpoint, "POST", bodyToSend, { timeoutMs: 20000 });
    } catch (innerErr) {
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
      const errMsg = response.error || response.message || "Onboarding failed";
      showNotification(errMsg, "error");
      console.warn("[onboarding] Onboarding failed:", response);
    }

    return response;
  } catch (err) {
    showLoading(false);
    const normalized = err instanceof Error ? err : new Error(String(err || "Unknown error"));
    console.error("[onboarding] Unexpected exception (normalized):", normalized, { raw: err });
    showNotification(normalized.message, "error");
    return { success: false, error: normalized.message };
  }
}
