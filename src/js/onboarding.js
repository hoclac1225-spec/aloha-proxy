import { validateUser } from "./validation.js";
import { callAPI } from "./api.js";

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
  try {
    const response = await callAPI(endpoint, "POST", userData);
    console.log("[onboarding] response:", response);

    if (!response) {
      return { success: false, error: "No response from callAPI" };
    }

    // Nếu API trả về định dạng chuẩn { success, data }
    if (typeof response === "object" && "success" in response) {
      return response;
    }

    // Nếu API trả về dữ liệu raw
    return { success: true, data: response };
  } catch (err) {
    console.error("[onboarding] Exception:", err);
    return { success: false, error: err?.message || "Unknown error" };
  }
}
