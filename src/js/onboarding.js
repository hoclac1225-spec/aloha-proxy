// src/js/onboarding.js
// Improved onboarding client: validation, robust error normalization, default payload,
// and global unhandledrejection logging to help detect "Uncaught (in promise) undefined".

import { callAPI } from "./api.js";
import { validateUser } from "./validation.js"; // keep your existing validation module

// UI helpers (keep or replace with your existing UI notification functions)
export function showNotification(message, type = "info") {
  const notif = document.createElement("div");
  notif.className = `onboarding-notif onboarding-${type}`;
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

export function showLoading(show = true) {
  let overlay = document.getElementById("onboarding-loading-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "onboarding-loading-overlay";
    overlay.className = "onboarding-loading-overlay";
    overlay.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(overlay);
  }
  overlay.style.display = show ? "flex" : "none";
}

// Global unhandled rejection logger — helps find "undefined" rejections
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (ev) => {
    console.error("Global unhandledrejection captured:", ev.reason);
    // Optionally show a UI notification for visibility in dev
    // showNotification(`Unhandled rejection: ${String(ev.reason)}`, "error");
  });
}

/**
 * Start onboarding
 * @param {Object} userData - { name, email, phone?, payload? }
 * @param {string} endpointOrBase
 * @returns {Promise<Object>}
 */
export async function startOnboarding(userData, endpointOrBase = "/api/onboard") {
  console.log("[onboarding] startOnboarding called with:", userData);

  // Validate using your validation.js
  const validationError = validateUser ? validateUser(userData) : null;
  if (validationError) {
    showNotification(validationError, "error");
    console.warn("[onboarding] Validation failed:", validationError);
    return { success: false, error: validationError };
  }

  // Ensure payload exists (server expects payload Json column)
  const bodyToSend = { ...userData };
  if (bodyToSend.payload == null) {
    bodyToSend.payload = {}; // default to empty object to satisfy Prisma Json field
  }

  // Resolve endpoint: if full URL provided, use it; else try runtime base
  const runtimeBase =
    typeof window !== "undefined" && window.SHOPIFY_APP_URL
      ? window.SHOPIFY_APP_URL.replace(/\/+$/, "")
      : null;

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
      // send as JSON by default
      response = await callAPI(endpoint, "POST", bodyToSend, { timeoutMs: 20000 });
    } catch (innerErr) {
      // Normalize to Error and return structured failure
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
      // keep returning response so caller can inspect
    }

    return response;
  } catch (err) {
    // Global catch: always normalize to Error instance and return structured error
    showLoading(false);
    const normalized = err instanceof Error ? err : new Error(String(err || "Unknown error"));
    console.error("[onboarding] Unexpected exception (normalized):", normalized, { raw: err, stack: normalized.stack });
    showNotification(normalized.message, "error");
    return { success: false, error: normalized.message };
  }
}
