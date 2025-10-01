// src/js/api.js
// Robust fetch wrapper: always throws Error instances on network/timeout problems,
// returns normalized object { ok, status, ...parsed } on successful HTTP response.

export async function callAPI(url, method = "GET", body = null, opts = {}) {
  const controller = new AbortController();
  const timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 15000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = { Accept: "application/json" };

    // If body is not FormData and is provided, assume JSON
    const isForm = typeof FormData !== "undefined" && body instanceof FormData;
    if (body && !isForm) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body && !isForm ? JSON.stringify(body) : body,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const ct = (res.headers.get("content-type") || "").toLowerCase();

    // Try parse JSON safely
    if (ct.includes("application/json") || ct.includes("application/hal+json")) {
      let parsed;
      try {
        parsed = await res.json();
      } catch (e) {
        // JSON parse error — include text for debugging
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to parse JSON response: ${String(e)}. Raw: ${txt}`);
      }
      // normalize shape
      return {
        ok: res.ok,
        status: res.status,
        ...parsed,
      };
    } else {
      // Not JSON: return object with raw text for debugging
      const text = await res.text().catch(() => "");
      return {
        ok: res.ok,
        status: res.status,
        error: `Unexpected content-type: ${ct || "none"}`,
        rawText: text,
      };
    }
  } catch (err) {
    clearTimeout(timeout);

    // normalize abort
    if (err && err.name === "AbortError") {
      throw new Error("Request timed out");
    }

    // ensure throwing an Error
    if (err instanceof Error) throw err;
    throw new Error(String(err || "Unknown network error"));
  }
}
