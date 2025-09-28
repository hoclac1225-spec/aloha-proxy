// src/js/api.js
/**
 * callAPI - helper fetch wrapper
 * - always tries to parse JSON response (if any)
 * - throws an Error for non-2xx responses with a readable message
 * - returns parsed JSON or { raw: text } if response not JSON
 */
export async function callAPI(url, method = "GET", body = null, headers = {}) {
  try {
    const opts = {
      method,
      headers: {
        Accept: "application/json",
        ...headers,
      },
    };

    if (body != null) {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    }

    const res = await fetch(url, opts);

    // Read raw text so we can parse or return raw for debugging
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      // Not JSON — return raw
      data = { raw: text };
    }

    if (!res.ok) {
      const errMsg =
        (data && (data.error || data.message)) || `HTTP ${res.status} ${res.statusText}`;
      // Throw so callers can catch a meaningful message
      throw new Error(errMsg);
    }

    return data;
  } catch (err) {
    console.error("[callAPI] error:", err);
    // Re-throw so upstream can handle/normalize
    throw err;
  }
}
