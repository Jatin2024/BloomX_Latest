import Section, { Reveal } from '../components/ui/Section';
import { ButtonLink, CheckIcon, Eyebrow } from '../components/ui/Primitives';
import siteContent from '../content/siteContent.json';
import { whyPoints } from '../content/catalog';
import { buildImage, media } from '../content/media';

const copy = siteContent.home.why;

const asideImage = buildImage(media.flatlayDesk, {
  ratio: [5, 4],
  sizes: '(min-width: 980px) 32vw, 92vw',
  widths: [480, 720, 960]
});

export default function WhyBloomX() {
  return (
    <Section aria-labelledby="why-title">
      <div className="bx-why__grid">
        <Reveal className="bx-why__aside">
          <div className="bx-sticky bx-stack">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <h2 id="why-title">{copy.title}</h2>
            <p className="bx-lead">{copy.text}</p>
            <figure className="bx-figure bx-figure--zoom bx-why__figure">
              <img {...asideImage} />
            </figure>
            <ButtonLink to="/contact" variant="ghost">
              Start a conversation
            </ButtonLink>
          </div>
        </Reveal>

        <div className="bx-why__list">
          {whyPoints.map((point, index) => (
            <Reveal className="bx-why__item" key={point.title} delay={index * 0.05} y={14}>
              <span className="bx-why__icon" aria-hidden="true">
                <CheckIcon />
              </span>
              <div>
                <h3 className="bx-why__title">{point.title}</h3>
                <p className="bx-why__text">{point.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
