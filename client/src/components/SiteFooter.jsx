import { Link } from 'react-router-dom';
import siteContent from '../content/siteContent.json';
import { services } from '../content/catalog';

const { footer, header, site } = siteContent;

export default function SiteFooter() {
  return (
    <footer className="bx-footer">
      <div className="bx-blueprint" aria-hidden="true" />
      <div className="bx-shell bx-shell--wide">
        <div className="bx-footer__grid">
          <div className="bx-footer__brand">
            <Link to="/" className="bx-brand" aria-label={`${site.name} — home`}>
              <img
                className="bx-brand__mark"
                src="/logo-mark.png"
                width="96"
                height="96"
                alt={header.brandAlt}
                loading="lazy"
              />
              <span className="bx-brand__name">
                <span className="bx-brand__word">BloomX</span>
                <span className="bx-brand__sub">Technologies</span>
              </span>
            </Link>
            <p className="bx-footer__statement">{footer.statement}</p>
            <p className="bx-eyebrow bx-eyebrow--plain bx-eyebrow--on-dark">{site.tagline}</p>
          </div>

          <div>
            <h2 className="bx-footer__heading">{footer.headings.services}</h2>
            <ul className="bx-footer__list">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link to={`/services#${service.slug}`}>{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="bx-footer__heading">{footer.headings.site}</h2>
            <ul className="bx-footer__list">
              {header.nav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="bx-footer__heading">{footer.headings.contact}</h2>
            <ul className="bx-footer__list">
              <li className="bx-footer__contact-item">
                <span className="bx-footer__contact-label">{footer.labels.email}</span>
                <a href={`mailto:${footer.contact.email}`}>{footer.contact.email}</a>
              </li>
              <li className="bx-footer__contact-item">
                <span className="bx-footer__contact-label">{footer.labels.phone}</span>
                <a href={`tel:${footer.contact.phone.replace(/[^+\d]/g, '')}`}>{footer.contact.phone}</a>
              </li>
              <li className="bx-footer__contact-item">
                <span className="bx-footer__contact-label">{footer.labels.location}</span>
                <span>{footer.contact.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bx-footer__bottom">
          <p>{footer.copy}</p>
          <nav className="bx-footer__bottom-links" aria-label="Footer">
            {footer.bottomLinks.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
