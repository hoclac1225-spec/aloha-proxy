// src/js/api.js
// Robust fetch wrapper - always throws Error with message on failure,
// always returns object on success.

export async function callAPI(url, method = "GET", body = null, opts = {}) {
  const controller = new AbortController();
  const timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 15000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = { Accept: "application/json" };
    const isForm = typeof FormData !== "undefined" && body instanceof FormData;

    if (body && !isForm) headers["Content-Type"] = "application/json";

    const res = await fetch(url, {
      method,
      headers,
      body: body && !isForm ? JSON.stringify(body) : body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct.includes("application/json") || ct.includes("application/hal+json")) {
      try {
        const json = await res.json();
        // normalize: always object with ok/status
        return Object.assign({ ok: res.ok, status: res.status }, json);
      } catch (e) {
        const raw = await res.text().catch(() => "");
        throw new Error(`Failed to parse JSON response: ${String(e)}. Raw: ${raw}`);
      }
    }

    // fallback to text
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${text || "no body"}`);
    }
    return { ok: true, status: res.status, rawText: text };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err && err.name === "AbortError") throw new Error("Request timed out");
    if (err instanceof Error) throw err;
    throw new Error(String(err || "Unknown network error"));
  }
}
