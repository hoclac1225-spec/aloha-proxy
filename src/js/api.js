// src/js/api.js
export async function callAPI(url, method = "GET", body = null, opts = {}) {
  const controller = new AbortController();
  const timeoutMs = opts.timeoutMs || 15000; // 15s default
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = { "Accept": "application/json" };
    if (body && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const ct = (res.headers.get("content-type") || "").toLowerCase();
    // Nếu server trả json -> parse, nếu text -> trả về để debug
    if (ct.includes("application/json") || ct.includes("application/ld+json")) {
      const parsed = await res.json();
      return {
        ok: res.ok,
        status: res.status,
        ...parsed,
      };
    } else {
      // not JSON -> return raw text for easier debugging
      const text = await res.text();
      return {
        ok: res.ok,
        status: res.status,
        error: `Unexpected content-type: ${ct}`,
        rawText: text,
      };
    }
  } catch (err) {
    clearTimeout(timeout);
    if (err && err.name === "AbortError") {
      // normalized Error
      throw new Error("Request timed out");
    }
    // Normalize thrown values (could be undefined etc.)
    throw err instanceof Error ? err : new Error(String(err));
  }
}
