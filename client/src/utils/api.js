const rawBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim();
const rawApiPrefix = String(import.meta.env.VITE_API_PREFIX || '/api').trim();

const baseUrl = rawBaseUrl.replace(/\/+$/, '');
const apiPrefix = (rawApiPrefix || '/api').replace(/^\/?/, '/').replace(/\/+$/, '');

export function buildApiUrl(path) {
  const suffix = String(path || '').startsWith('/') ? String(path) : `/${String(path || '')}`;
  return `${baseUrl}${apiPrefix}${suffix}`;
}
