export async function callAPI(url, method = "GET", body = null) {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { success: false, error: `HTTP ${res.status}: ${text}` };
    }

    const data = await res.json().catch(() => null);

    return { success: true, data };
  } catch (err) {
    console.error("[callAPI] Error:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}
