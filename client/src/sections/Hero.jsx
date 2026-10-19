import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import BloomMark from '../components/brand/BloomMark';
import { ArrowIcon } from '../components/ui/Primitives';
import siteContent from '../content/siteContent.json';
import { buildImage, media } from '../content/media';
import { duration, easing, lineReveal, stagger } from '../utils/motion';

const { hero } = siteContent.home;

const heroImage = buildImage(media.heroWorkspace, {
  ratio: [4, 5],
  sizes: '(min-width: 1024px) 46vw, 92vw',
  widths: [480, 720, 960, 1280],
  priority: true
});

export default function Hero() {
  return (
    <section className="bx-hero" aria-labelledby="hero-title">
      <div className="bx-blueprint" aria-hidden="true" />

      <div className="bx-shell bx-shell--wide bx-hero__inner">
        <div className="bx-hero__grid">
          <m.div
            className="bx-hero__copy"
            variants={stagger(0.09, 0.08)}
            initial="hidden"
            animate="visible"
          >
            <m.p
              className="bx-eyebrow bx-eyebrow--on-dark"
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easing } }
              }}
            >
              {hero.eyebrow}
            </m.p>

            <h1 id="hero-title" className="bx-hero__title">
              {hero.titleLines.map((line, index) => (
                <span className="bx-line" key={line}>
                  <m.span style={{ display: 'block' }} variants={lineReveal}>
                    {index === hero.accentLine ? <em>{line}</em> : line}
                  </m.span>
                </span>
              ))}
            </h1>

            <m.p
              className="bx-hero__text"
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easing } }
              }}
            >
              {hero.text}
            </m.p>

            <m.div
              className="bx-hero__actions"
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easing } }
              }}
            >
              <Link to="/contact" className="bx-btn bx-btn--primary bx-btn--lg">
                {hero.primaryCta}
                <ArrowIcon />
              </Link>
              <Link to="/services" className="bx-btn bx-btn--on-dark bx-btn--lg">
                {hero.secondaryCta}
              </Link>
            </m.div>
          </m.div>

          <m.div
            className="bx-hero__media"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, ease: easing, delay: 0.12 }}
          >
            <figure className="bx-figure bx-figure--scrim bx-figure--zoom bx-hero__figure">
              <img {...heroImage} />
              <figcaption className="bx-figure__caption">
                <span className="bx-figure__label">{hero.figureLabel}</span>
                <p>{hero.figureCaption}</p>
              </figcaption>
            </figure>

            <span className="bx-hero__chip">
              <span className="bx-hero__pulse" aria-hidden="true" />
              {hero.chip}
            </span>

            <BloomMark className="bx-hero__lattice" />
          </m.div>
        </div>

        <m.div
          className="bx-hero__signals"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.slow, ease: easing, delay: 0.5 }}
        >
          {hero.signals.map((signal) => (
            <div className="bx-signal" key={signal.title}>
              <p className="bx-signal__title">{signal.title}</p>
              <p className="bx-signal__text">{signal.text}</p>
            </div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
