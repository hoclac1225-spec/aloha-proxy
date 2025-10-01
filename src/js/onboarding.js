// src/js/onboarding.js
import { validateUser } from "./validation.js";

/**
 * Gọi API an toàn, check HTTP lỗi
 */
export async function callAPI(url, method = "GET", body = null) {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Nếu HTTP error, đọc text trả về
    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, error: `HTTP ${res.status}: ${errorText}` };
    }

    // Nếu response không phải JSON
    const data = await res.json().catch(() => null);

    return { success: true, data };
  } catch (err) {
    console.error("[callAPI] Error:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}

/**
 * Hiển thị thông báo tạm thời trên trang
 */
export function showNotification(message, type = "info") {
  const notif = document.createElement("div");
  notif.className = `onboarding-notif onboarding-${type}`;
  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => notif.remove(), 3000);
}

/**
 * Hiển thị loading overlay
 */
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

/**
 * startOnboarding
 * @param {Object} userData - dữ liệu user
 * @param {string} endpointOrBase - endpoint hoặc base URL cho API
 */
export async function startOnboarding(userData, endpointOrBase = "/api/onboard") {
  // Validate dữ liệu
  const validationError = validateUser(userData);
  if (validationError) {
    console.error("[onboarding] Validation Error:", validationError);
    showNotification(validationError, "error");
    return { success: false, error: validationError };
  }

  // Xác định endpoint cuối cùng
  let endpoint = endpointOrBase || "/api/onboard";
  const isFullUrl = /^https?:\/\//i.test(endpoint);
  const isAbsolutePath = endpoint.startsWith("/");
  const runtimeBase =
    typeof window !== "undefined" && window.SHOPIFY_APP_URL
      ? window.SHOPIFY_APP_URL.replace(/\/+$/, "")
      : null;

  if (!isFullUrl) {
    if (isAbsolutePath) {
      endpoint = runtimeBase ? runtimeBase + endpoint : endpoint;
    } else {
      const looksLikeBase = endpoint.includes(".") || endpoint.includes("localhost");
      endpoint = looksLikeBase
        ? endpoint.replace(/\/+$/, "") + "/api/onboard"
        : runtimeBase
        ? runtimeBase + "/" + endpoint.replace(/^\/+/, "")
        : "/" + endpoint;
    }
  }

  console.log("[onboarding] resolved endpoint:", endpoint);

  // Gọi API
  showLoading(true);
  try {
    const response = await callAPI(endpoint, "POST", userData);
    showLoading(false);
    console.log("[onboarding] response:", response);

    if (!response) {
      showNotification("No response from server", "error");
      return { success: false, error: "No response from callAPI" };
    }

    if (typeof response === "object" && "success" in response) {
      if (response.success) showNotification("Onboarding successful!", "success");
      else showNotification(response.error || "Onboarding failed", "error");
      return response;
    }

    showNotification("Onboarding completed!", "success");
    return { success: true, data: response };
  } catch (err) {
    showLoading(false);
    console.error("[onboarding] Exception:", err);
    showNotification(err?.message || "Unknown error", "error");
    return { success: false, error: err?.message || "Unknown error" };
  }
}
