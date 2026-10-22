import Section, { Reveal } from '../components/ui/Section';
import { ArrowIcon, ButtonLink, Eyebrow } from '../components/ui/Primitives';
import EmailLink from '../components/ui/EmailLink';
import siteContent from '../content/siteContent.json';

const { footer } = siteContent;
const defaultCopy = siteContent.home.cta;

/**
 * Conversion band, reused at the foot of every page. The direct contact
 * details are the real ones configured in siteContent.footer.contact.
 */
export default function CtaBand({ copy = defaultCopy, secondaryTo = '/services' }) {
  return (
    <Section tone="default" className="bx-section--cta">
      <Reveal className="bx-cta">
        <div className="bx-cta__inner">
          <div>
            <Eyebrow className="bx-eyebrow--on-dark">{copy.eyebrow}</Eyebrow>
            <h2 className="bx-cta__title" style={{ marginTop: 'var(--space-4)' }}>
              {copy.title}
            </h2>
            <p className="bx-cta__text">{copy.text}</p>
          </div>

          <div className="bx-cta__actions">
            <ButtonLink to="/contact" size="lg" block>
              {copy.primary}
              <ArrowIcon />
            </ButtonLink>
            <ButtonLink to={secondaryTo} variant="onDark" size="lg" block>
              {copy.secondary}
            </ButtonLink>

            <div className="bx-cta__direct">
              <div className="bx-cta__direct-item">
                <span className="bx-cta__direct-label">{footer.labels.email}</span>
                <EmailLink email={footer.contact.email} subject={siteContent.contact.emailSubject} onDark />
              </div>
              <div className="bx-cta__direct-item">
                <span className="bx-cta__direct-label">{footer.labels.phone}</span>
                <a href={`tel:${footer.contact.phone.replace(/[^+\d]/g, '')}`}>
                  {footer.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
