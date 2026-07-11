import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';
import PageHeader from '../components/PageHeader';
import siteContent from '../content/siteContent.json';
import { fadeUpProps } from '../utils/motion';

const { contact } = siteContent;

export default function ContactPage() {
  return (
    <main>
      <motion.section className="py-4 interactive-section contact-hero-section" {...fadeUpProps}>
        <div className="row g-4 align-items-center">
          <div className="col-lg-7">
            <div className="section-eyebrow mb-3">Contact</div>
            <PageHeader title={contact.pageTitle} subtitle={contact.introDescription} />
          </div>
          <div className="col-lg-5">
            <motion.div
              className="contact-hero-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <div className="contact-hero-badge">Let’s build together</div>
              <h3>{contact.introTitle}</h3>
              <p className="mb-3">{contact.responseTime}</p>
              <a className="contact-hero-link" href={`mailto:${contact.directEmail}`}>{contact.directEmail}</a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section className="py-4 interactive-section contact-content-section" {...fadeUpProps}>
        <div className="row g-4 align-items-stretch">
          <div className="col-lg-5">
            <div className="contact-info-card rounded-4 p-4 p-lg-5 shadow-sm h-100">
              <div className="section-eyebrow mb-3">Project briefing</div>
              <h3 className="mb-3">{contact.highlightTitle}</h3>
              <ul className="contact-highlights mb-4">
                {contact.highlightPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="d-flex flex-wrap gap-2">
                {contact.chips.map((chip) => (
                  <span key={chip} className="contact-chip">{chip}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="contact-form-shell rounded-4 p-4 p-lg-5 shadow-sm h-100">
              <ContactForm />
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
