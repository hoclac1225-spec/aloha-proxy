// src/js/api.js
// Robust fetch wrapper that normalizes responses and errors.

export async function callAPI(url, method = "GET", body = null, opts = {}) {
  const controller = new AbortController();
  const timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 15000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = { Accept: "application/json" };
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

    if (ct.includes("application/json") || ct.includes("application/hal+json")) {
      let parsed;
      try {
        parsed = await res.json();
      } catch (e) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to parse JSON response: ${String(e)}. Raw: ${txt}`);
      }
      return { ok: res.ok, status: res.status, ...parsed };
    } else {
      const text = await res.text().catch(() => "");
      return { ok: res.ok, status: res.status, error: `Unexpected content-type: ${ct || "none"}`, rawText: text };
    }
  } catch (err) {
    clearTimeout(timeout);
    if (err && err.name === "AbortError") throw new Error("Request timed out");
    if (err instanceof Error) throw err;
    throw new Error(String(err || "Unknown network error"));
  }
}
