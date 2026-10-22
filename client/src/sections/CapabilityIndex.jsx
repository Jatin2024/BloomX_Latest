import { Link } from 'react-router-dom';
import { staggerDelay } from '../utils/motion';
import Section, { Reveal } from '../components/ui/Section';
import { MetaLine, SectionHeading } from '../components/ui/Primitives';
import siteContent from '../content/siteContent.json';
import { services } from '../content/catalog';

const copy = siteContent.home.services;

/**
 * Services as an editorial index rather than a card grid: one hairline row
 * per capability, each a link through to its detail block on /services.
 */
export default function CapabilityIndex() {
  return (
    <Section tone="sunken" className="bx-section--close" aria-labelledby="capabilities-title">
      <SectionHeading
        split
        eyebrow={copy.eyebrow}
        title={copy.title}
        text={copy.text}
        className="bx-stack"
      />

      <div className="bx-rows bx-rows--index">
        {services.map((service, index) => (
          <Reveal key={service.slug} delay={staggerDelay(index)} y={16}>
            <Link className="bx-capability" to={`/services#${service.slug}`}>
              <span className="bx-capability__index">{String(index + 1).padStart(2, '0')}</span>

              <h3 className="bx-capability__title">
                {service.title}
                <span className="bx-capability__caret" aria-hidden="true">
                  →
                </span>
              </h3>

              <div className="bx-capability__detail">
                <p className="bx-capability__text">{service.summary}</p>
                <MetaLine items={service.indexTags} />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
