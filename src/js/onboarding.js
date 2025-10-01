// onboarding.js
// Hoàn chỉnh - includes showNotification, showLoading, and hardened startOnboarding
// Usage: import { startOnboarding, showNotification, showLoading } from './onboarding.js';


import { callAPI } from "./api.js";
import { validateUser } from "./validation.js";


export function showNotification(message, type = "info") {
try {
const notif = document.createElement("div");
notif.className = `onboarding-notif onboarding-${type}`;
notif.textContent = message || String(message);


notif.style.position = "fixed";
notif.style.right = "20px";
notif.style.top = "20px";
notif.style.zIndex = 99999;
notif.style.padding = "10px 14px";
notif.style.borderRadius = "8px";
notif.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
notif.style.fontFamily = "system-ui,Segoe UI,Roboto,'Helvetica Neue',Arial";
notif.style.fontSize = "13px";
notif.style.color = "#fff";
notif.style.maxWidth = "320px";
notif.style.wordBreak = "break-word";


if (type === "success") notif.style.background = "#16a34a";
else if (type === "error") notif.style.background = "#dc2626";
else notif.style.background = "#0ea5e9";


document.body.appendChild(notif);
setTimeout(() => {
try { notif.remove(); } catch (e) {}
}, 4000);
} catch (e) {
console.warn("showNotification fallback:", message, e);
}
}


export function showLoading(show = true) {
try {
let overlay = document.getElementById("onboarding-loading-overlay");
if (!overlay) {
overlay = document.createElement("div");
overlay.id = "onboarding-loading-overlay";
overlay.style.position = "fixed";
overlay.style.left = 0;
overlay.style.top = 0;
overlay.style.right = 0;
overlay.style.bottom = 0;
overlay.style.display = "none";
overlay.style.alignItems = "center";
overlay.style.justifyContent = "center";
overlay.style.background = "rgba(0,0,0,0.35)";
overlay.style.zIndex = 99998;


const spinner = document.createElement("div");
spinner.className = "onboarding-spinner";
spinner.style.width = "48px";
spinner.style.height = "48px";
spinner.style.border = "6px solid rgba(255,255,255,0.25)";
spinner.style.borderTopColor = "#ffffff";
}
