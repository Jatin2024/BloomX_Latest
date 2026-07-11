export const easing = [0.22, 1, 0.36, 1];

export const viewportOnce = {
  once: false,
  amount: 0.2
};

export const fadeUpProps = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: viewportOnce,
  transition: {
    duration: 0.6,
    ease: easing
  }
};

export const pageTransitionProps = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: {
    duration: 0.38,
    ease: easing
  }
};