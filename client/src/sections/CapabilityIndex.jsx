import { Link } from 'react-router-dom';
import Section, { Reveal } from '../components/ui/Section';
import { ArrowIcon, SectionHeading, Tags } from '../components/ui/Primitives';
import siteContent from '../content/siteContent.json';
import { services } from '../content/catalog';

const copy = siteContent.home.services;

/**
 * Services as an editorial index rather than a card grid: one hairline row
 * per capability, each a link through to its detail block on /services.
 */
export default function CapabilityIndex() {
  return (
    <Section tone="sunken" aria-labelledby="capabilities-title">
      <SectionHeading
        split
        eyebrow={copy.eyebrow}
        title={copy.title}
        text={copy.text}
        className="bx-stack"
      />

      <div className="bx-rows" style={{ marginTop: 'var(--space-10)' }}>
        {services.map((service, index) => (
          <Reveal key={service.slug} delay={Math.min(index * 0.05, 0.25)} y={16}>
            <Link className="bx-capability" to={`/services#${service.slug}`}>
              <span className="bx-capability__index">{String(index + 1).padStart(2, '0')}</span>

              <h3 className="bx-capability__title">{service.title}</h3>

              <div>
                <p className="bx-capability__text">{service.summary}</p>
                <Tags items={service.indexTags} className="bx-capability__meta" />
              </div>

              <span className="bx-capability__go" aria-hidden="true">
                <ArrowIcon />
              </span>
              <span className="bx-capability__mobile-cta">{copy.cta}</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
