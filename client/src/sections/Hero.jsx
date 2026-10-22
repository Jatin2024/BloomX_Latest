import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import BloomMark from '../components/brand/BloomMark';
import Media from '../components/ui/Media';
import { ArrowIcon } from '../components/ui/Primitives';
import siteContent from '../content/siteContent.json';
import { buildImage, media } from '../content/media';
import { cascade, duration, ease, lineReveal, riseIn, stagger } from '../utils/motion';

const { hero } = siteContent.home;

/*
 * The only full-colour photograph on the site, and the LCP element.
 *
 * NOTE: these values are mirrored by the <link rel="preload"> in
 * index.html so the download can start during HTML parse rather than
 * after the bundle boots. Change one, change the other, or the browser
 * fetches the image twice.
 */
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

      <div className="bx-hero__inner">
        <div className="bx-hero__layout">
          <div className="bx-hero__copy-col">
            {/*
              Entrance timeline. The whole hero is settled inside ~750ms of
              mount: the headline cascades line by line while the supporting
              copy and buttons come in underneath it, rather than queueing
              behind it. The CTAs are in place and clickable well before the
              last line lands.
            */}
            <m.div
              className="bx-hero__copy"
              variants={cascade(stagger.loose, 0.04)}
              initial="hidden"
              animate="visible"
            >
              <m.p className="bx-eyebrow bx-eyebrow--on-dark" variants={riseIn}>
                {hero.eyebrow}
              </m.p>

              <m.h1
                id="hero-title"
                className="bx-hero__title"
                variants={cascade(stagger.tight)}
              >
                {hero.titleLines.map((line, index) => (
                  <span className="bx-line" key={line}>
                    <m.span style={{ display: 'block' }} variants={lineReveal}>
                      {index === hero.accentLine ? <em>{line}</em> : line}
                    </m.span>
                  </span>
                ))}
              </m.h1>

              <m.p className="bx-hero__text" variants={riseIn}>
                {hero.text}
              </m.p>

              <m.div className="bx-hero__actions" variants={riseIn}>
                <Link to="/contact" className="bx-btn bx-btn--primary bx-btn--lg">
                  {hero.primaryCta}
                  <ArrowIcon />
                </Link>
                <Link to="/services" className="bx-btn bx-btn--on-dark bx-btn--lg">
                  {hero.secondaryCta}
                </Link>
              </m.div>
            </m.div>
          </div>

          <m.div
            className="bx-hero__media"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slower, ease: ease.entrance, delay: 0.06 }}
          >
            <Media image={heroImage} className="bx-hero__figure" scrim skeletonTone="dark" />

            <span className="bx-hero__chip">
              <span className="bx-hero__pulse" aria-hidden="true" />
              {hero.chip}
            </span>

            <BloomMark className="bx-hero__lattice" />
          </m.div>
        </div>

        <m.div
          className="bx-shell bx-shell--wide bx-hero__signals"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.slow, ease: ease.entrance, delay: 0.34 }}
        >
          {hero.signals.map((signal, index) => (
            <div className="bx-signal" key={signal.title}>
              <span className="bx-signal__index">{String(index + 1).padStart(2, '0')}</span>
              <p className="bx-signal__title">{signal.title}</p>
              <p className="bx-signal__text">{signal.text}</p>
            </div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
