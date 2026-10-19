import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HASH_WAIT_MS = 1500;

/**
 * Scroll management for client-side navigation.
 *
 * A plain route change resets to the top. A route with a hash
 * (/services#apis, /contact#enquiry) scrolls to that element instead — the
 * browser does not do this itself for in-app navigation, and because the
 * page transition mounts the new route a few hundred milliseconds later,
 * the target is polled until it exists.
 *
 * Same-page anchors glide; arriving from another page jumps straight there,
 * which is what a link to a specific section should feel like. `scroll-
 * padding-top` on <html> keeps the target clear of the fixed header.
 */
export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return undefined;
    }

    const id = decodeURIComponent(hash.slice(1));
    const alreadyRendered = Boolean(document.getElementById(id));
    const behavior = alreadyRendered ? 'smooth' : 'auto';
    const startedAt = performance.now();

    let frame = 0;
    let cancelled = false;

    const seek = () => {
      if (cancelled) return;
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior, block: 'start' });
        return;
      }
      if (performance.now() - startedAt < HASH_WAIT_MS) {
        frame = window.requestAnimationFrame(seek);
      }
    };

    frame = window.requestAnimationFrame(seek);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [pathname, hash, key]);

  return null;
}
