// api.js - robust callAPI
export async function callAPI(url, method = "GET", body = null, opts = {}) {
  const controller = new AbortController();
  const timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 15000; // 15s default
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = { Accept: "application/json" };
    if (body && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    // allow caller to add custom headers
    if (opts.headers && typeof opts.headers === "object") {
      Object.assign(headers, opts.headers);
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const status = res.status;
    const ok = res.ok === true;

    // 204/205 No Content
    if (status === 204 || status === 205) {
      return { ok, status, data: null, error: ok ? null : `HTTP ${status}`, rawText: "" };
    }

    const ct = (res.headers.get("content-type") || "").toLowerCase();

    let rawText = null;
    let data = null;
    let parseError = null;

    // Prefer JSON if content-type indicates; but also try-catch parse if content-type missing
    if (ct.includes("application/json")) {
      try {
        data = await res.json();
      } catch (e) {
        parseError = `Failed to parse JSON response: ${String(e)}`;
        rawText = await res.text().catch(() => null);
      }
    } else {
      // try to read text first; if it looks like JSON, attempt parse
      rawText = await res.text().catch(() => null);
      if (rawText) {
        const trimmed = rawText.trim();
        if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
          try {
            data = JSON.parse(trimmed);
          } catch (e) {
            parseError = `Failed to parse JSON from text response: ${String(e)}`;
          }
        }
      }
    }

    // Normalize result shape
    const result = {
      ok,
      status,
      data: data ?? null,
      error: null,
      rawText: rawText ?? null,
    };

    // If response status not ok, attach error info
    if (!ok) {
      // If server returned structured error in data (common patterns)
      const serverMessage =
        (data && (data.error || data.message || data.msg)) ||
        parseError ||
        (rawText ? rawText : `HTTP ${status}`);
      result.error = serverMessage;
    } else if (parseError) {
      // if 2xx but parse failed, surface parse error
      result.error = parseError;
    }

    return result;
  } catch (err) {
    clearTimeout(timeout);
    // Normalize errors: AbortError -> timeout message
    if (err && err.name === "AbortError") {
      throw new Error("Request timed out");
    }
    // Network errors or other unexpected errors
    throw err instanceof Error ? err : new Error(String(err));
  }
}
