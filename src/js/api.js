// api.js - supports JSON and FormData via opts.asFormData
export async function callAPI(url, method = "GET", body = null, opts = {}) {
  const controller = new AbortController();
  const timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 15000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // build headers; when sending FormData do NOT set Content-Type (browser fills boundary)
    const headers = { Accept: "application/json" };
    if (!opts.asFormData && body && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    if (opts.headers && typeof opts.headers === "object") {
      Object.assign(headers, opts.headers);
    }

    const fetchBody =
      opts.asFormData && body && !(body instanceof FormData)
        ? objectToFormData(body)
        : body && !(body instanceof FormData) && !opts.asFormData
        ? JSON.stringify(body)
        : body;

    const res = await fetch(url, {
      method,
      headers,
      body: fetchBody,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const status = res.status;
    const ok = res.ok === true;

    if (status === 204 || status === 205) {
      return { ok, status, data: null, error: ok ? null : `HTTP ${status}`, rawText: "" };
    }

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
      rawText = await res.text().catch(() => null);
      const trimmed = rawText ? rawText.trim() : "";
      if (trimmed && ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]")))) {
        try { data = JSON.parse(trimmed); } catch (e) { parseError = `Failed to parse JSON from text response: ${String(e)}`; }
      }
    }

    const result = { ok, status, data: data ?? null, error: null, rawText: rawText ?? null };
    if (!ok) {
      const serverMessage = (data && (data.error || data.message || data.msg)) || parseError || (rawText ? rawText : `HTTP ${status}`);
      result.error = serverMessage;
    } else if (parseError) {
      result.error = parseError;
    }

    return result;
  } catch (err) {
    clearTimeout(timeout);
    if (err && err.name === "AbortError") throw new Error("Request timed out");
    throw err instanceof Error ? err : new Error(String(err));
  }
}

// helper: convert plain object to FormData (supports arrays, nested simple values as JSON)
function objectToFormData(obj) {
  const fd = new FormData();
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    // if file-like (has .name and is Blob/File) append directly
    if (typeof v === "object" && (v instanceof Blob || (v.name && v.size))) {
      fd.append(k, v);
    } else if (Array.isArray(v)) {
      // append arrays as multiple fields with same name
      v.forEach(item => fd.append(k, typeof item === "object" ? JSON.stringify(item) : String(item)));
    } else if (typeof v === "object") {
      fd.append(k, JSON.stringify(v));
    } else {
      fd.append(k, String(v));
    }
  });
  return fd;
}
