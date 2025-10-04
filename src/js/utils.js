// utils.js

// ChuyÃƒÂ¡Ã‚Â»Ã†â€™n object thÃƒÆ’Ã‚Â nh query string
export function toQueryString(params) {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

// Delay (vÃƒÆ’Ã‚Â­ dÃƒÂ¡Ã‚Â»Ã‚Â¥ dÃƒÆ’Ã‚Â¹ng trong demo/loading)
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
