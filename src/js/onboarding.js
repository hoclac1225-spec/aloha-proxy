export async function startOnboarding(userData = {}) {
  try {
    await new Promise((res) => setTimeout(res, 100));
    return { ok: true, message: "Onboarding started", user: userData };
  } catch (err) {
    return { ok: false, error: err?.message || String(err) };
  }
}

export default startOnboarding;
