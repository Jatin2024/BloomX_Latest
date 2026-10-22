import Section, { Reveal } from '../components/ui/Section';
import { staggerDelay } from '../utils/motion';
import { ButtonLink, Eyebrow } from '../components/ui/Primitives';
import siteContent from '../content/siteContent.json';
import { whyPoints } from '../content/catalog';

const copy = siteContent.home.why;

/**
 * Commitments as a numbered editorial list.
 *
 * Deliberately has no icons: a repeated tick next to every line carries no
 * information and reads as decoration. The numerals do the indexing, the
 * titles do the work, and the left column holds a statement rather than a
 * stock photograph.
 */
export default function WhyBloomX() {
  return (
    <Section aria-labelledby="why-title">
      <div className="bx-why__grid">
        <Reveal className="bx-why__aside">
          <div className="bx-sticky bx-stack">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <h2 id="why-title">{copy.title}</h2>
            <p className="bx-lead">{copy.text}</p>

            <blockquote className="bx-pullquote">
              <p>{copy.quote}</p>
            </blockquote>

            <div>
              <ButtonLink to="/contact" variant="ghost">
                Start a conversation
              </ButtonLink>
            </div>
          </div>
        </Reveal>

        <ol className="bx-why__list">
          {whyPoints.map((point, index) => (
            <Reveal as="li" className="bx-why__item" key={point.title} delay={staggerDelay(index)} y={14}>
              <span className="bx-why__num">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="bx-why__title">{point.title}</h3>
                <p className="bx-why__text">{point.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
