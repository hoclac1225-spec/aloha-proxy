export async function startOnboarding(userData, endpointOrBase = "/api/onboard") {
  console.log("[onboarding] startOnboarding called with:", userData);

  const validationError = validateUser(userData);
  if (validationError) {
    showNotification(validationError, "error");
    return { success: false, error: validationError };
  }

  const runtimeBase =
    typeof window !== "undefined" && window.SHOPIFY_APP_URL
      ? window.SHOPIFY_APP_URL.replace(/\/+$/, "")
      : null;

  const endpoint = endpointOrBase && endpointOrBase.startsWith && endpointOrBase.startsWith("http")
    ? endpointOrBase
    : runtimeBase
      ? runtimeBase + endpointOrBase
      : endpointOrBase;

  console.log("[onboarding] resolved endpoint:", endpoint);

  if (!endpoint || typeof endpoint !== "string") {
    const errMsg = "Invalid endpoint resolved for onboarding: " + String(endpoint);
    showNotification(errMsg, "error");
    return { success: false, error: errMsg };
  }

  showLoading(true);
  try {
    let response;
    try {
      // Important: send as FormData because server expects multipart/form-data
      response = await callAPI(endpoint, "POST", userData, { asFormData: true, timeoutMs: 20000 });
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
      showNotification(msg, "error");
      return { success: false, error: msg, raw: response };
    }

    if (response.ok === true) {
      showNotification("Onboarding successful!", "success");
    } else {
      const errMsg = (response.data && (response.data.error || response.data.message)) || response.error || `Onboarding failed (status ${response.status})`;
      showNotification(errMsg, "error");
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
