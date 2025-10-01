import { validateUser } from "./validation.js";
import { callAPI } from "./api.js";

export async function startOnboarding(userData, endpointOrBase = "/api/onboard") {
  const validationError = validateUser(userData);
  if (validationError) {
    console.error("[onboarding] Validation Error:", validationError);
    return { success: false, error: validationError };
  }

  let endpoint = endpointOrBase || "/api/onboard";
  const isFullUrl = /^https?:\/\//i.test(endpoint);
  const isAbsolutePath = endpoint.startsWith("/");
  const runtimeBase = typeof window !== "undefined" && window.SHOPIFY_APP_URL ? window.SHOPIFY_APP_URL : null;

  if (!isFullUrl) {
    if (isAbsolutePath) {
      endpoint = runtimeBase ? runtimeBase.replace(/\/+$/, "") + endpoint : endpoint;
    } else {
      const looksLikeBase = endpoint.includes(".") || endpoint.includes("localhost");
      endpoint = looksLikeBase
        ? endpoint.replace(/\/+$/, "") + "/api/onboard"
        : runtimeBase
        ? runtimeBase.replace(/\/+$/, "") + "/" + endpoint.replace(/^\/+/, "")
        : "/" + endpoint;
    }
  }

  console.log("[onboarding] resolved endpoint:", endpoint);

  try {
    const response = await callAPI(endpoint, "POST", userData);
    console.log("[onboarding] response:", response);

    if (!response) return { success: false, error: "No response from callAPI" };
    if ("success" in response) return response;
    return { success: true, data: response };
  } catch (err) {
    console.error("[onboarding] Exception:", err);
    return { success: false, error: err?.message || "Unknown error" };
  }
}
