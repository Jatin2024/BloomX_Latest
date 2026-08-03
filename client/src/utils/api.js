const rawBaseUrl = String(import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim();
const rawApiPrefix = String(import.meta.env.VITE_API_PREFIX || '/api').trim();

const baseUrl = rawBaseUrl.replace(/\/+$/, '');
const apiPrefix = (rawApiPrefix || '/api').replace(/^\/?/, '/').replace(/\/+$/, '');

export function buildApiUrl(path) {
  const suffix = String(path || '').startsWith('/') ? String(path) : `/${String(path || '')}`;

  if (!baseUrl) {
    return `${apiPrefix}${suffix}`;
  }

  // Prevent accidental double /api when base URL already includes it.
  if (baseUrl.endsWith(apiPrefix)) {
    return `${baseUrl}${suffix}`;
  }

  return `${baseUrl}${apiPrefix}${suffix}`;
}
