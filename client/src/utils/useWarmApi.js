import { useEffect } from 'react';
import { buildApiUrl } from './api';

/**
 * Wakes the API when a form page mounts.
 *
 * On hosts that idle a free service to sleep (Render, Fly scale-to-zero),
 * the first request after a quiet period pays the whole cold start — often
 * the better part of a minute. If that lands on the visitor's submit, the
 * form appears to hang and they give up.
 *
 * Pinging /api/health on mount moves that cost to the moment the page
 * opens, so the service is warming while the form is being filled in. It is
 * strictly fire-and-forget: the result is ignored, failures are swallowed,
 * and nothing in the UI depends on it.
 */
export default function useWarmApi() {
  useEffect(() => {
    const controller = new AbortController();
    // Don't hold a request open if the service is slow to wake.
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    fetch(buildApiUrl('/health'), {
      method: 'GET',
      signal: controller.signal,
      // A stale cached response is fine; the point is the round trip.
      cache: 'no-store'
    }).catch(() => {
      /* offline, cold, rate-limited — all irrelevant here */
    });

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);
}
