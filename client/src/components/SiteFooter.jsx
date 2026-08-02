import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import siteContent from '../content/siteContent.json';
import { fadeUpProps } from '../utils/motion';

const { footer } = siteContent;

export default function SiteFooter() {
  return (
    <motion.footer className="site-footer mt-auto" {...fadeUpProps} viewport={{ once: false, amount: 0.05 }}>
      <div className="container py-4 py-lg-5">
        <div className="row g-4 align-items-start footer-main-row">
          <div className="col-lg-4">
            <div className="footer-brand-row mb-3">
              <NavLink to="/" className="footer-brand-link" aria-label="BloomX Home">
                <img className="footer-brand-logo" src="/BloomX.png" alt="BloomX logo" />
              </NavLink>
              <div className="section-eyebrow mb-0">{footer.headline}</div>
            </div>
            <h4 className="footer-title mb-3">{footer.tagline}</h4>
            <p className="footer-description mb-4">{footer.description}</p>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {footer.highlights.map((highlight) => (
                <span key={highlight} className="footer-chip">{highlight}</span>
              ))}
            </div>
            <p className="footer-note mb-0">{footer.note}</p>
          </div>

          <div className="col-sm-6 col-lg-3">
            <h6 className="footer-heading">{footer.headings.services}</h6>
            <ul className="footer-list">
              {footer.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div className="col-sm-6 col-lg-5">
            <h6 className="footer-heading">{footer.headings.contact}</h6>
            <ul className="footer-list footer-contact-list">
              <li><span>{footer.labels.email}</span><a href={`mailto:${footer.contact.email}`}>{footer.contact.email}</a></li>
              <li><span>{footer.labels.phone}</span><a href={`tel:${footer.contact.phone.replace(/[^+\d]/g, '')}`}>{footer.contact.phone}</a></li>
              <li><span>{footer.labels.location}</span><span>{footer.contact.location}</span></li>
            </ul>
            <div className="footer-links mt-4">
              <NavLink className={({ isActive }) => isActive ? 'footer-link footer-link-active' : 'footer-link'} to="/services">{footer.links.services}</NavLink>
              <NavLink className={({ isActive }) => isActive ? 'footer-link footer-link-active' : 'footer-link'} to="/contact">{footer.links.contact}</NavLink>
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-4 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <p className="mb-0 footer-copy">{footer.copy}</p>
          <div className="footer-mini-links d-flex flex-wrap gap-3">
            <NavLink className={({ isActive }) => isActive ? 'footer-link footer-link-small footer-link-active' : 'footer-link footer-link-small'} to="/services">{footer.links.services}</NavLink>
            <NavLink className={({ isActive }) => isActive ? 'footer-link footer-link-small footer-link-active' : 'footer-link footer-link-small'} to="/contact">{footer.links.contact}</NavLink>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
