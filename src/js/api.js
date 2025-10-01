// api.js - robust callAPI supporting JSON and FormData
rawText = await res.text().catch(() => null);
const trimmed = rawText ? rawText.trim() : "";
if (trimmed && ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]")))) {
try { data = JSON.parse(trimmed); } catch (e) { parseError = `Failed to parse JSON from text response: ${String(e)}`; }
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
if (typeof value === "object" && (value instanceof Blob || (value.name && value.size && typeof value.stream === "function"))) {
fd.append(key, value);
return;
}
if (Array.isArray(value)) {
value.forEach((v) => appendValue(key, v));
return;
}
if (typeof value === "object") {
try { fd.append(key, JSON.stringify(value)); } catch (e) { fd.append(key, String(value)); }
return;
}
fd.append(key, String(value));
}


Object.entries(obj || {}).forEach(([k, v]) => {
appendValue(k, v);
});


return fd;
}
