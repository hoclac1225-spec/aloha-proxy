// src/js/api.js
// Robust callAPI supporting JSON and FormData (no weird syntax)

export async function callAPI(url, method = "GET", body = null, opts = {}) {
  const controller = new AbortController();
  const timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 15000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = { Accept: "application/json" };
    if (!opts.asFormData && body && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    if (opts.headers && typeof opts.headers === "object") {
      Object.assign(headers, opts.headers);
    }

    const fetchBody = (opts.asFormData && body && !(body instanceof FormData))
      ? objectToFormData(body)
      : (body && !(body instanceof FormData) && !opts.asFormData)
        ? JSON.stringify(body)
        : body;

    // do the request
    const res = await fetch(url, {
      method,
      headers,
      body: fetchBody,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const status = res.status;
    const ok = res.ok === true;

    // handle no-content
    if (status === 204 || status === 205) {
      return { ok, status, data: null, error: ok ? null : `HTTP ${status}`, rawText: "" };
    }

    const ct = (res.headers.get("content-type") || "").toLowerCase();
    let data = null;
    let rawText = null;
    let parseError = null;

    if (ct.includes("application/json")) {
      try {
        data = await res.json();
      } catch (e) {
        parseError = `Failed to parse JSON response: ${String(e)}`;
        rawText = await res.text().catch(() => null);
      }
    } else {
      // not JSON: keep raw text and attempt best-effort parse
      rawText = await res.text().catch(() => null);
      const trimmed = rawText ? rawText.trim() : "";
      if (trimmed && ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]")))) {
        try {
          data = JSON.parse(trimmed);
        } catch (e) {
          parseError = `Failed to parse JSON from text response: ${String(e)}`;
        }
      }
    }

    const result = {
      ok,
      status,
      data: data ?? null,
      error: null,
      rawText: rawText ?? null,
    };

    if (!ok) {
      const serverMessage = (data && (data.error || data.message || data.msg)) || parseError || (rawText ? rawText : `HTTP ${status}`);
      result.error = serverMessage;
    } else if (parseError) {
      result.error = parseError;
    }

    return result;
  } catch (err) {
    clearTimeout(timeout);
    if (err && err.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
}

function objectToFormData(obj) {
  const fd = new FormData();

  function appendValue(key, value) {
    if (value === undefined || value === null) return;
    if (value instanceof Blob || (value && typeof value === "object" && typeof value.stream === "function")) {
      fd.append(key, value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(v => appendValue(key, v));
      return;
    }
    if (typeof value === "object") {
      try { fd.append(key, JSON.stringify(value)); } catch (e) { fd.append(key, String(value)); }
      return;
    }
    fd.append(key, String(value));
  }

  Object.entries(obj || {}).forEach(([k, v]) => appendValue(k, v));
  return fd;
}
