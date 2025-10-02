// src/js/api.js
// Nhỏ gọn, defensive fetch helper that expects JSON responses (or text fallback).

/**
 * Safe fetch wrapper for JSON endpoints.
 * @param {string} url
 * @param {object} options - fetch options (method, headers, body...)
 * @returns {Promise<{ok: boolean, status: number, data?: any, error?: string}>}
 */
export async function fetchJson(url, options = {}) {
  const opts = {
    credentials: "same-origin",
    ...options,
  };

  // ensure headers object
  opts.headers = opts.headers || {};
  if (opts.body && typeof opts.body === "object" && !(opts.body instanceof FormData)) {
    // assume JSON body
    opts.headers["Content-Type"] = opts.headers["Content-Type"] || "application/json";
    opts.body = JSON.stringify(opts.body);
  }

  try {
    const res = await fetch(url, opts);

    // try parse JSON safely
    let text = await res.text();
    let data = null;
    let parseError = null;
    if (text && text.length) {
      try {
        data = JSON.parse(text.trim());
      } catch (e) {
        parseError = `Failed to parse JSON from text response: ${String(e)}`;
      }
    }

    if (!res.ok) {
      const errMsg = (data && data.error) || (data && data.message) || parseError || `HTTP ${res.status}`;
      return { ok: false, status: res.status, error: errMsg, data };
    }

    // success
    return { ok: true, status: res.status, data: data ?? text };
  } catch (err) {
    return { ok: false, status: 0, error: String(err) };
  }
}
