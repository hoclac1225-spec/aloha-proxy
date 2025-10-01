// startOnboarding.js
import { validateUser } from "./validation.js";
import { callAPI } from "./api.js";

// Import CSS để áp dụng style
import "../styles/style.css";          // 1 cấp lên, vào styles
import "../styles/content-script.css";  // 1 cấp lên, vào styles

/**
 * Hiển thị thông báo tạm thời trên trang
 * @param {string} message - nội dung thông báo
 * @param {"error"|"success"|"info"} type - kiểu thông báo
 */
function showNotification(message, type = "info") {
  const notif = document.createElement("div");
  notif.className = `onboarding-notif onboarding-${type}`;
  notif.textContent = message;

  // Thêm vào body
  document.body.appendChild(notif);

  // Tự động ẩn sau 3 giây
  setTimeout(() => {
    notif.remove();
  }, 3000);
}

/**
 * Hiển thị loading overlay
 */
function showLoading(show = true) {
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
  // 1. Validate dữ liệu
  const validationError = validateUser(userData);
  if (validationError) {
    console.error("[onboarding] Validation Error:", validationError);
    showNotification(validationError, "error");
    return { success: false, error: validationError };
  }

  // 2. Xác định endpoint cuối cùng
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

  // 3. Gọi API và handle lỗi
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
