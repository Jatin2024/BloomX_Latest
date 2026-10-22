import { m } from 'framer-motion';
import { Eyebrow } from './Primitives';
import { cascade, lineReveal, riseIn, stagger } from '../../utils/motion';

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
          variants={cascade(stagger.loose, 0.04)}
          initial="hidden"
          animate="visible"
        >
          <div className="bx-stack">
            <m.div variants={riseIn}>
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

          <m.div className="bx-stack bx-stack--sm" variants={riseIn}>
            {text && <p className="bx-page-hero__text">{text}</p>}
            {aside}
          </m.div>
        </m.div>

        {children}
      </div>
    </section>
  );
}
