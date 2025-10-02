// src/js/api.js
export async function postJson(url, body, opts = {}) {
  const headers = Object.assign(
    { "Content-Type": "application/json", Accept: "application/json" },
    opts.headers || {}
  );

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    ...opts,
  });

  const text = await res.text();
  let data;
  let parseError = null;
  const trimmed = (text || "").trim();
  if (!trimmed) {
    data = null;
  } else {
    try {
      data = JSON.parse(trimmed);
    } catch (e) {
      parseError = `Failed to parse JSON from text response: ${String(e)}`;
      data = trimmed;
    }
  }

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.response = data;
    err.parseError = parseError;
    throw err;
  }

  return data;
}
