/**
 * Motion system.
 *
 * Principles:
 *  - One timing scale, shared with styles/tokens.css. The values below are
 *    the same numbers in seconds, so a CSS hover and a JS entrance on the
 *    same element move at the same speed. Change one, change the other.
 *  - Three easing curves, each with a defined job.
 *  - Transform and opacity only. Nothing here animates a property that
 *    triggers layout or paint.
 *  - Entrances fire once. Nothing re-animates on scroll-back.
 *  - `prefers-reduced-motion` is honoured globally by MotionConfig in
 *    App.jsx, which strips transforms and leaves opacity. Scroll-linked
 *    motion opts out separately via `useReducedMotion()`.
 */

/* ---- Easing --------------------------------------------------------------
   entrance  things arriving — decelerate hard, settle softly
   ui        hover, focus, press — short and crisp at both ends
   exit      things leaving — accelerate away, no lingering               */

export const ease = {
  entrance: [0.22, 1, 0.36, 1],
  ui: [0.4, 0, 0.2, 1],
  exit: [0.4, 0, 1, 1]
};

/* ---- Duration (seconds; mirrors --dur-* in tokens.css) ------------------ */

export const duration = {
  instant: 0.12,
  fast: 0.2,
  base: 0.32,
  slow: 0.48,
  slower: 0.68
};

/* ---- Stagger -------------------------------------------------------------
   A shared rhythm so every list on the site cascades at the same rate, and
   a cap so a long list never trails far behind the one above it.          */

export const stagger = {
  tight: 0.04,
  base: 0.06,
  loose: 0.08
};

const STAGGER_CAP = 0.24;

/** Delay for item `index` in a cascading list, capped so tails stay short. */
export function staggerDelay(index, step = stagger.base, cap = STAGGER_CAP) {
  return Math.min(index * step, cap);
}

/** Variant container that cascades its direct motion children. */
export const cascade = (step = stagger.base, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren } }
});

/* ---- In-view trigger ----------------------------------------------------- */

export const viewport = {
  once: true,
  amount: 0.2,
  margin: '0px 0px -10% 0px'
};

/* ---- Variants ------------------------------------------------------------ */

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.entrance }
  }
};

/** Small rise for secondary text inside a cascade. */
export const riseIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.entrance }
  }
};

/** Masked line reveal — pair with a parent that has `overflow: hidden`. */
export const lineReveal = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: duration.slow, ease: ease.entrance }
  }
};

/* ---- Shared prop bundles -------------------------------------------------- */

export const fadeUpProps = {
  variants: fadeUp,
  initial: 'hidden',
  whileInView: 'visible',
  viewport
};

/** Route change: in on the entrance curve, out quickly on the exit curve. */
export const pageTransitionProps = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.entrance }
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: duration.fast, ease: ease.exit }
  }
};
