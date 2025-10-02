// src/js/onboarding.js
import { fetchJson } from "./api.js";

/**
 * startOnboarding(data)
 * data: { name, email, phone, payload } where payload is an object
 *
 * Returns a promise that resolves to {ok, status, data, error}
 */
export async function startOnboarding(data = {}) {
  // minimal validation
  if (!data || typeof data !== "object") {
    return { ok: false, error: "Invalid data" };
  }

  // ensure payload exists as an object (server expects `payload` present)
  if (data.payload == null) {
    data.payload = {};
  }

  // POST JSON to server endpoint
  const result = await fetchJson("/api/onboard", {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  });

  if (!result.ok) {
    // throw or return an informative error
    // keep consistent: return object, do not throw to avoid uncaught in promise in UI unless desired
    return {
      ok: false,
      status: result.status,
      error: result.error || "Onboarding failed",
      data: result.data,
    };
  }

  return { ok: true, status: result.status, data: result.data };
}

