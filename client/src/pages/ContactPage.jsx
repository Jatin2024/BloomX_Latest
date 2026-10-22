import { useEffect, useMemo, useRef } from 'react';
import { stagger } from '../utils/motion';
import { useLocation, useSearchParams } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import Section, { Reveal } from '../components/ui/Section';
import { Eyebrow } from '../components/ui/Primitives';
import EmailLink from '../components/ui/EmailLink';
import ContactForm from '../components/ContactForm';
import siteContent from '../content/siteContent.json';
import { getService } from '../content/catalog';
import useDocumentMeta from '../utils/useDocumentMeta';
import useWarmApi from '../utils/useWarmApi';

const copy = siteContent.contact;
const { footer } = siteContent;

export default function ContactPage() {
  useDocumentMeta({ ...copy.meta, path: '/contact' });

  // Wake a sleeping API while the form is being filled in.
  useWarmApi();

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const panelRef = useRef(null);

  // /contact?service=apis arrives from a service block and pre-fills the
  // message so the visitor does not have to restate why they came.
  const prefill = useMemo(() => {
    const service = getService(searchParams.get('service'));
    return service ? `${copy.servicePrefill}${service.title}.\n\n` : '';
  }, [searchParams]);

  // ScrollToTop already moves the page to the hash target; this only puts the
  // caret in the first field. `#contact-form` is the previous site's anchor,
  // kept working so older links still land correctly.
  useEffect(() => {
    const targetsForm = location.hash === '#enquiry' || location.hash === '#contact-form';
    if (!targetsForm || !panelRef.current) return undefined;

    if (location.hash === '#contact-form') {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const timeoutId = window.setTimeout(() => {
      panelRef.current?.querySelector('input, textarea')?.focus({ preventScroll: true });
    }, 480);

    return () => window.clearTimeout(timeoutId);
  }, [location.hash]);

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} text={copy.text} />

      <Section tight>
        <div className="bx-contact__grid">
          <Reveal className="bx-contact__aside">
            <div className="bx-stack bx-stack--sm">
              <Eyebrow>{copy.asideEyebrow}</Eyebrow>
              <div className="bx-contact__steps">
                {copy.steps.map((step, index) => (
                  <p className="bx-contact__step" key={step}>
                    <span className="bx-contact__step-num">{String(index + 1).padStart(2, '0')}</span>
                    <span>{step}</span>
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="bx-label">{copy.detailsEyebrow}</h2>
              <div className="bx-stack bx-stack--sm">
                <div className="bx-contact__detail">
                  <span className="bx-contact__detail-label">{footer.labels.email}</span>
                  <EmailLink email={footer.contact.email} subject={copy.emailSubject} />
                </div>
                <div className="bx-contact__detail">
                  <span className="bx-contact__detail-label">{footer.labels.phone}</span>
                  <a href={`tel:${footer.contact.phone.replace(/[^+\d]/g, '')}`}>
                    {footer.contact.phone}
                  </a>
                </div>
                <div className="bx-contact__detail">
                  <span className="bx-contact__detail-label">{footer.labels.location}</span>
                  <span>{footer.contact.location}</span>
                  <span className="bx-contact-note">{footer.contact.locationNote}</span>
                </div>
                <div className="bx-contact__detail">
                  <span className="bx-contact__detail-label">{copy.responseLabel}</span>
                  <span>{copy.responseTime}</span>
                </div>
              </div>
            </div>
          </Reveal>

          <div ref={panelRef} id="enquiry">
            <Reveal className="bx-form-panel" delay={stagger.loose}>
              <div className="bx-stack bx-stack--sm" style={{ marginBottom: 'var(--space-6)' }}>
                <h2>{copy.formTitle}</h2>
                <p className="bx-field__hint">{copy.formText}</p>
              </div>
              <ContactForm initialMessage={prefill} />
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
