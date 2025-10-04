// utils.js

// Chuyá»ƒn object thÃ nh query string
export function toQueryString(params) {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

// Delay (vÃ­ dá»¥ dÃ¹ng trong demo/loading)
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
