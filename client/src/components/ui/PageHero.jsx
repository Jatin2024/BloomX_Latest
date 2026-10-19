import { m } from 'framer-motion';
import { Eyebrow } from './Primitives';
import { duration, easing, lineReveal, stagger } from '../../utils/motion';

/**
 * Shared opening band for inner pages. Keeps every page's first screen on
 * the same grid and rhythm while leaving room for page-specific extras.
 */
export default function PageHero({ eyebrow, title, text, children, aside }) {
  return (
    <section className="bx-page-hero">
      <div className="bx-shell">
        <m.div
          className="bx-page-hero__grid"
          variants={stagger(0.08, 0.05)}
          initial="hidden"
          animate="visible"
        >
          <div className="bx-stack">
            <m.div
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easing } }
              }}
            >
              <Eyebrow>{eyebrow}</Eyebrow>
            </m.div>

            <h1 className="bx-page-hero__title">
              <span className="bx-line">
                <m.span style={{ display: 'block' }} variants={lineReveal}>
                  {title}
                </m.span>
              </span>
            </h1>
          </div>

          <m.div
            className="bx-stack bx-stack--sm"
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easing } }
            }}
          >
            {text && <p className="bx-page-hero__text">{text}</p>}
            {aside}
          </m.div>
        </m.div>

        {children}
      </div>
    </section>
  );
}
