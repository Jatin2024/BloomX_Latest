/**
 * Image manifest.
 *
 * Photography is sourced from Unsplash (free licence, no attribution
 * required) and is always art-directed in-page with a navy scrim so it stays
 * inside the BloomX palette. Every entry carries its own descriptive alt
 * text; decorative-only usage passes `alt: ''` at the call site.
 *
 * `buildImage()` returns a ready-to-spread props object with a responsive
 * srcSet, explicit intrinsic dimensions (so nothing shifts while loading)
 * and sensible loading hints.
 */

const UNSPLASH_HOST = 'https://images.unsplash.com';
const DEFAULT_WIDTHS = [480, 768, 1024, 1440, 1920];

/* Quality 60 is indistinguishable here once the duotone treatment is applied
   and the delivered format is AVIF/WebP via `auto=format`. */
const DEFAULT_QUALITY = 60;

/** Photo ids verified to resolve against images.unsplash.com. */
export const media = {
  heroWorkspace: {
    id: 'photo-1550439062-609e1531270e',
    alt: 'Overhead view of a developer working at a desk lit by two large light panels'
  },
  studioPair: {
    id: 'photo-1551434678-e076c223a692',
    alt: 'Two developers working side by side at desks with large monitors'
  },
  teamSession: {
    id: 'photo-1522071820081-009f0129c71c',
    alt: 'A small team reviewing work together around laptops'
  },
  flatlayDesk: {
    id: 'photo-1519389950473-47ba0277781c',
    alt: 'Overhead view of a shared desk with laptops, notebooks and phones'
  },
  circuitry: {
    id: 'photo-1518770660439-4636190af475',
    alt: 'Close-up of a circuit board'
  },
  serverRoom: {
    id: 'photo-1558494949-ef010cbdcc31',
    alt: 'Rows of networking equipment with patch cabling in a data centre'
  },
  codeOnLaptop: {
    id: 'photo-1498050108023-c5249f4df085',
    alt: 'A laptop on a clean desk showing source code in an editor'
  },
  dashboardScreen: {
    id: 'photo-1551288049-bebda4e38f71',
    alt: 'An analytics dashboard with charts displayed on a wide screen'
  },
  codeDetail: {
    id: 'photo-1542831371-29b0f74f9713',
    alt: 'Close-up of syntax-highlighted markup on a dark editor screen'
  },
  devtools: {
    id: 'photo-1517180102446-f3ece451e9d8',
    alt: 'Browser developer tools open over a web page'
  },
  typingHands: {
    id: 'photo-1486312338219-ce68d2c6f44d',
    alt: 'Hands typing on a laptop keyboard at a desk'
  },
  retailCheckout: {
    id: 'photo-1556740738-b6a63e27c4df',
    alt: 'A shop assistant taking a card payment on a tablet point-of-sale system'
  },
  officeTeam: {
    id: 'photo-1521737604893-d14cc237f11d',
    alt: 'Colleagues working together around a table in an open-plan office'
  },
  scheduleScreen: {
    id: 'photo-1460925895917-afdab827c52f',
    alt: 'A laptop showing a scheduling and reporting interface on a desk'
  },
  notebookPlanning: {
    id: 'photo-1484480974693-6ca0a78fb36b',
    alt: 'A hand writing project notes in a grid notebook'
  }
};

export function unsplashUrl(id, width, ratio, quality = DEFAULT_QUALITY, desaturate = false) {
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    w: String(width),
    q: String(quality)
  });

  if (ratio) {
    params.set('h', String(Math.round((width * ratio[1]) / ratio[0])));
  }

  // Images rendered with the duotone treatment are greyscaled in CSS anyway,
  // so asking the CDN for a desaturated original costs nothing visually and
  // compresses roughly 20% smaller.
  if (desaturate) {
    params.set('sat', '-100');
  }

  return `${UNSPLASH_HOST}/${id}?${params.toString()}`;
}

/**
 * @param {{id: string, alt: string}} source  entry from `media`
 * @param {object} [options]
 * @param {[number, number]} [options.ratio]  intended aspect ratio, e.g. [16, 9]
 * @param {string} [options.sizes]            CSS `sizes` attribute
 * @param {number[]} [options.widths]         candidate widths for srcSet
 * @param {number} [options.quality]          Unsplash quality (default 72)
 * @param {boolean} [options.priority]        skip lazy loading for above-the-fold art
 * @param {string} [options.alt]              override alt text ('' marks it decorative)
 */
export function buildImage(source, options = {}) {
  const {
    ratio,
    sizes = '100vw',
    widths = DEFAULT_WIDTHS,
    quality = DEFAULT_QUALITY,
    priority = false,
    desaturate = false,
    alt
  } = options;

  const largest = widths[widths.length - 1];

  return {
    src: unsplashUrl(source.id, largest, ratio, quality, desaturate),
    srcSet: widths
      .map((w) => `${unsplashUrl(source.id, w, ratio, quality, desaturate)} ${w}w`)
      .join(', '),
    sizes,
    alt: alt === undefined ? source.alt : alt,
    width: largest,
    height: ratio ? Math.round((largest * ratio[1]) / ratio[0]) : undefined,
    loading: priority ? 'eager' : 'lazy',
    decoding: priority ? 'sync' : 'async',
    // Lowercase: React 18 passes unknown all-lowercase attributes straight
    // through, while `fetchPriority` (React 19 spelling) warns here.
    // Below-the-fold art is explicitly deprioritised so it cannot compete
    // with the hero for bandwidth on a slow connection.
    fetchpriority: priority ? 'high' : 'low'
  };
}
