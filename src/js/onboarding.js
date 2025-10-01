// src/js/onboarding.js
import { callAPI } from "./api.js";

// Nếu bạn có file validateUser / showNotification / showLoading khác,
// import tương ứng. Nếu không, file này có các fallback đơn giản.
function defaultValidateUser(data) {
  if (!data) return "Missing user data";
  if (!data.name || typeof data.name !== "string") return "Missing name";
  if (!data.email || typeof data.email !== "string") return "Missing email";
  return null;
}

export function showNotification(message, type = "info") {
  try {
    const notif = document.createElement("div");
    notif.className = `onboarding-notif onboarding-${type}`;
    notif.textContent = message;
    Object.assign(notif.style, {
      position: "fixed",
      right: "16px",
      top: "16px",
      zIndex: 99999,
      background: "#222",
      color: "#fff",
      padding: "8px 12px",
      borderRadius: "6px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
    });
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
  } catch (e) {
    // no DOM? ignore
    console.warn("showNotification fallback:", e);
  }
}

export function showLoading(show = true) {
  try {
    let overlay = document.getElementById("onboarding-loading-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "onboarding-loading-overlay";
      overlay.className = "onboarding-loading-overlay";
      Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
        zIndex: 99998,
      });
      overlay.innerHTML = `<div style="width:48px;height:48px;border-radius:50%;border:6px solid rgba(255,255,255,0.2);border-top-color:#fff;animation:spin 1s linear infinite"></div>
      <style>
      @keyframes spin { to { transform: rotate(360deg) } }
      </style>`;
      document.body.appendChild(overlay);
    }
    overlay.style.display = show ? "flex" : "none";
  } catch (e) {
    console.warn("showLoading fallback:", e);
  }
}

// If your repo already has a validateUser export, replace this default with import.
const validateUser = defaultValidateUser;

export async function startOnboarding(userData, endpointOrBase = "/api/onboard") {
  console.log("[onboarding] startOnboarding called with:", userData);

  const validationError = validateUser(userData);
  if (validationError) {
    showNotification(validationError, "error");
    console.warn("[onboarding] Validation failed:", validationError);
    return { success: false, error: validationError };
  }

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
      response = await callAPI(endpoint, "POST", userData, { timeoutMs: 20000 });
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
    console.error("[onboarding] Unexpected exception:", err);
    const msg = err && err.message ? err.message : String(err || "Unknown error");
    showNotification(msg, "error");
    return { success: false, error: msg };
  }
}
