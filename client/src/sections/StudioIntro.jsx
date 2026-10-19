import Section, { Reveal } from '../components/ui/Section';
import { Eyebrow } from '../components/ui/Primitives';
import siteContent from '../content/siteContent.json';
import { buildImage, media } from '../content/media';

const { intro } = siteContent.home;

const introImage = buildImage(media.studioPair, {
  ratio: [4, 5],
  sizes: '(min-width: 960px) 44vw, 92vw',
  widths: [480, 720, 960, 1200]
});

export default function StudioIntro() {
  return (
    <Section tone="default" aria-labelledby="intro-title">
      <div className="bx-intro__grid">
        <Reveal className="bx-intro__media">
          <figure className="bx-figure bx-figure--zoom bx-intro__figure">
            <img {...introImage} />
            <figcaption className="bx-intro__figure-badge">{intro.figureBadge}</figcaption>
          </figure>
        </Reveal>

        <Reveal className="bx-stack" delay={0.08}>
          <Eyebrow>{intro.eyebrow}</Eyebrow>
          <h2 id="intro-title">{intro.title}</h2>
          <p className="bx-lead">{intro.text}</p>

          <div className="bx-intro__points">
            {intro.points.map((point, index) => (
              <div className="bx-intro__point" key={point.title}>
                <span className="bx-intro__point-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="bx-intro__point-title">{point.title}</h3>
                  <p className="bx-intro__point-text">{point.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
