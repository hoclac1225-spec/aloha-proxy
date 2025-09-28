// utils.js

// Chuyển object thành query string
export function toQueryString(params) {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

// Delay (ví dụ dùng trong demo/loading)
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
