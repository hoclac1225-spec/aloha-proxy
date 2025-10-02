// src/js/onboarding.js
import { postJson } from "./api";

async function submitOnboard(payload) {
  try {
    const body = {
      // luôn gửi payload bên trong key "payload" để tương thích DB
      payload,
      meta: { source: "frontend", ts: new Date().toISOString() },
    };

    const resp = await postJson("/api/onboard", body);
    console.log("Onboard success:", resp);
    return resp;
  } catch (err) {
    console.error("onboarding failed:", err);
    // show friendly error in UI if you have one
    // (err.response may contain prisma/server error)
    throw err;
  }
}

// If you have a form with id "onboard-form" wired in your page:
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#onboard-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      // if features is sent as repeated inputs, convert accordingly
      try {
        await submitOnboard(payload);
        alert("Sent onboard request");
      } catch (err) {
        alert("Onboard failed. Check console/logs.");
      }
    });
  }
});

// For manual test from browser console:
window.__onboardSubmit = submitOnboard;
