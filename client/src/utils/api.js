const rawBaseUrl = String(import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim();
const rawApiPrefix = String(import.meta.env.VITE_API_PREFIX || '/api').trim();

const baseUrl = rawBaseUrl.replace(/\/+$/, '');
const apiPrefix = (rawApiPrefix || '/api').replace(/^\/?/, '/').replace(/\/+$/, '');

/**
 * Interpret an API response.
 *
 * A 2xx only counts as success if the body actually parses as JSON. An SPA
 * rewrite, reverse proxy, CDN interstitial or captive portal can all answer
 * a POST with `200 text/html`; treating that as success shows a green toast
 * and clears the form, so the visitor believes they have been in touch when
 * nothing was ever submitted.
 *
 * @returns {Promise<{ok: boolean, message: string|undefined}>}
 */
export async function readApiResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  const parsed = data !== null && typeof data === 'object';

  return {
    ok: response.ok && parsed,
    message: parsed && typeof data.message === 'string' ? data.message : undefined
  };
}

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
