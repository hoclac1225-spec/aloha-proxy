import { callAPI } from "./api.js"; 
import { validateUser } from "./validation.js";

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

  const endpoint = endpointOrBase.startsWith("http")
    ? endpointOrBase
    : runtimeBase
    ? runtimeBase + endpointOrBase
    : endpointOrBase;

  console.log("[onboarding] resolved endpoint:", endpoint);

  showLoading(true);
  try {
    const response = await callAPI(endpoint, "POST", userData);
    showLoading(false);
    console.log("[onboarding] API response:", response);

    if (!response || typeof response !== "object") {
      showNotification("No response from server", "error");
      return { success: false, error: "No response from callAPI" };
    }

    if (response.ok) {
      showNotification("Onboarding successful!", "success");
      console.info("[onboarding] Onboarding completed successfully.");
    } else {
      showNotification(response.error || "Onboarding failed", "error");
      console.warn("[onboarding] Onboarding failed:", response.error);
    }

    return response;
  } catch (err) {
    showLoading(false);
    console.error("[onboarding] Exception:", err);
    showNotification(err?.message || "Unknown error", "error");
    return { success: false, error: err?.message || "Unknown error" };
  }
}
