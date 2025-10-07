// src/js/onboarding.js
import { validateUser } from "./validation.js";
import { callAPI } from "./api.js";

/**
 * startOnboarding(userData, endpointOrBase = '/api/onboard')
 *
 * - If running in browser and window.SHOPIFY_APP_URL exists, relative paths will be prefixed with it.
 * - endpointOrBase supports:
 *    - full URL: "https://domain/api/onboard"
 *    - base URL: "https://domain"  -> will become https://domain/api/onboard
 *    - absolute path: "/api/onboard" -> will be prefixed with window.SHOPIFY_APP_URL if available
 *    - relative path or omitted -> "/api/onboard" relative to current origin or prefixed by window.SHOPIFY_APP_URL
 *
 * Returns always an object:
 *  { success: true, data: ... } or { success: false, error: '...' }
 */
export async function startOnboarding(userData, endpointOrBase = "/api/onboard") {
  const validationError = validateUser(userData);
  if (validationError) {
    console.error("[onboarding] Validation Error:", validationError);
    return { success: false, error: validationError };
  }

  // Resolve endpoint
  let endpoint = endpointOrBase || "/api/onboard";
  const isFullUrl = typeof endpoint === "string" && /^https?:\/\//i.test(endpoint);
  const isAbsolutePath = typeof endpoint === "string" && endpoint.startsWith("/");
  const runtimeBase =
    typeof window !== "undefined" && window.SHOPIFY_APP_URL ? window.SHOPIFY_APP_URL : null;

  if (!isFullUrl) {
    if (isAbsolutePath) {
      // "/api/onboard" -> prefix with runtimeBase if available
      endpoint = runtimeBase ? runtimeBase.replace(/\/+$/, "") + endpoint : endpoint;
    } else {
      // Not full URL and not absolute path -> could be base or relative
      // If it looks like a domain/base (contains dot or 'localhost'), treat as base
      const looksLikeBase =
        typeof endpoint === "string" && (endpoint.includes(".") || endpoint.includes("localhost"));
      if (looksLikeBase) {
        endpoint = endpoint.replace(/\/+$/, "") + "/api/onboard";
      } else {
        // relative path name like "api/onboard" or omitted -> prefix with runtimeBase or make absolute
        if (runtimeBase) {
          endpoint = runtimeBase.replace(/\/+$/, "") + "/" + endpoint.replace(/^\/+/, "");
        } else {
          endpoint = endpoint.startsWith("/") ? endpoint : "/" + endpoint;
        }
      }
    }
  }

  console.log("[onboarding] resolved endpoint:", endpoint);

  try {
    const response = await callAPI(endpoint, "POST", userData);
    console.log("[onboarding] response:", response);

    if (!response) {
      return { success: false, error: "No response from callAPI" };
    }

    if (typeof response === "object") {
      if ("success" in response) return response;
      return { success: true, data: response };
    }

    return { success: true, data: response };
  } catch (err) {
    console.error("[onboarding] Exception:", err);
    return { success: false, error: err?.message || String(err) || "Unknown error" };
  }
}
