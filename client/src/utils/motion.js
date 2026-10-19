/**
 * Motion tokens.
 *
 * One easing curve and four durations, used everywhere. Everything animates
 * transform and opacity only — no layout-affecting properties — and
 * `prefers-reduced-motion` is honoured globally by MotionConfig in App.jsx.
 */

export const easing = [0.22, 1, 0.36, 1];

export const duration = {
  fast: 0.18,
  base: 0.36,
  slow: 0.58,
  slower: 0.82
};

/** In-view trigger: fires once, slightly before the element is fully visible. */
export const viewport = {
  once: true,
  amount: 0.25,
  margin: '0px 0px -8% 0px'
};

export const transition = {
  base: { duration: duration.base, ease: easing },
  slow: { duration: duration.slow, ease: easing }
};

/* ---- Variants ----------------------------------------------------------- */

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: transition.slow }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.slow }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: duration.slower, ease: easing } }
};

/** Masked line reveal — pair with a parent that has `overflow: hidden`. */
export const lineReveal = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: duration.slower, ease: easing } }
};

export const stagger = (children = 0.07, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: children, delayChildren: delay } }
});

/* ---- Shared prop bundles -------------------------------------------------- */

export const fadeUpProps = {
  variants: fadeUp,
  initial: 'hidden',
  whileInView: 'visible',
  viewport
};

export const staggerProps = (children, delay) => ({
  variants: stagger(children, delay),
  initial: 'hidden',
  whileInView: 'visible',
  viewport
});

export const pageTransitionProps = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: easing }
};

/** Hover lift used on buttons and interactive cards. */
export const hoverLift = {
  whileHover: { y: -2 },
  whileTap: { y: 0, scale: 0.99 },
  transition: { duration: duration.fast, ease: easing }
};
