// api.js - robust callAPI supporting JSON and FormData
// - use opts.asFormData = true to send body as multipart/form-data
// - returns normalized result: { ok, status, data, error, rawText }
// - throws Error for network/timeout errors

export async function callAPI(url, method = "GET", body = null, opts = {}) {
  const controller = new AbortController();
  const timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 15000; // default 15s
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Build headers: if sending FormData, DO NOT set Content-Type (browser will set with boundary)
    const headers = { Accept: "application/json" };
    if (!opts.asFormData && body && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    if (opts.headers && typeof opts.headers === "object") {
      Object.assign(headers, opts.headers);
    }

    // Convert body to appropriate fetch body
    const fetchBody =
      opts.asFormData && body && !(body instanceof FormData)
        ? objectToFormData(body)
        : body && !(body instanceof FormData) && !opts.asFormData
        ? JSON.stringify(body)
        : body;

    // Debug log (lightweight)
    if (opts.debug) {
      try {
        console.debug("[callAPI] fetch", method, url, {
          bodyPreview: typeof body === "string" ? body.slice(0, 500) : JSON.stringify(body).slice(0, 500),
          asFormData: !!opts.asFormData,
        });
      } catch (e) {}
    }

    const res = await fetch(url, {
      method,
      headers,
      body: fetchBody,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const status = res.status;
    const ok = res.ok === true;

    // Handle no-content responses
    if (status === 204 || status === 205) {
      return { ok, status, data: null, error: ok ? null : `HTTP ${status}`, rawText: "" };
    }

    // Read response
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    let rawText = null;
    let data = null;
    let parseError = null;

    if (ct.includes("application/json")) {
      try {
        data = await res.json();
      } catch (e) {
        parseError = `Failed to parse JSON response: ${String(e)}`;
        rawText = await res.text().catch(() => null);
      }
    } else {
      // Try to read text and attempt JSON parse if it looks like JSON
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

    // Normalize result shape
    const result = {
      ok,
      status,
      data: data ?? null,
      error: null,
      rawText: rawText ?? null,
    };

    if (!ok) {
      // prefer structured server error when available
      const serverMessage =
        (data && (data.error || data.message || data.msg)) ||
        parseError ||
        (rawText ? rawText : `HTTP ${status}`);
      result.error = serverMessage;
    } else if (parseError) {
      result.error = parseError;
    }

    return result;
  } catch (err) {
    clearTimeout(timeout);
    // Normalize abort error
    if (err && err.name === "AbortError") {
      throw new Error("Request timed out");
    }
    // Normalize other thrown values
    throw err instanceof Error ? err : new Error(String(err));
  }
}

/**
 * Convert a plain object to FormData.
 * - Supports primitive values, arrays, nested objects (stringified), and File/Blob objects.
 * - Arrays are appended as multiple fields with same name.
 */
function objectToFormData(obj) {
  const fd = new FormData();

  function appendValue(key, value) {
    if (value === undefined || value === null) return;
    // File-ish object (Blob or File)
    if (typeof value === "object" && (value instanceof Blob || (value.name && value.size && typeof value.stream === "function"))) {
      fd.append(key, value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v) => appendValue(key, v));
      return;
    }
    if (typeof value === "object") {
      // stringify nested objects
      try {
        fd.append(key, JSON.stringify(value));
      } catch (e) {
        fd.append(key, String(value));
      }
      return;
    }
    fd.append(key, String(value));
  }

  Object.entries(obj || {}).forEach(([k, v]) => {
    appendValue(k, v);
  });

  return fd;
}
