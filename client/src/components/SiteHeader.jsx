import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import siteContent from '../content/siteContent.json';
import { cascade, duration, ease, riseIn, stagger } from '../utils/motion';

const { header, footer, site } = siteContent;

/** Routes whose first viewport is a dark band — the header starts
 *  transparent over them and turns solid once you scroll. */
const DARK_HERO_ROUTES = new Set(['/']);

export default function SiteHeader() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef(null);
  const panelRef = useRef(null);

  const routeTone = DARK_HERO_ROUTES.has(pathname) ? 'dark' : 'light';
  // While the mobile panel is open the header sits on top of it, so it
  // adopts the panel's dark treatment rather than its own route's.
  const tone = menuOpen ? 'dark' : routeTone;
  const state = menuOpen || (!scrolled && routeTone === 'dark') ? 'transparent' : 'solid';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the panel on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock scroll, close on Escape, and keep focus inside the open panel.
  useEffect(() => {
    if (!menuOpen) {
      document.body.classList.remove('is-nav-open');
      return undefined;
    }

    document.body.classList.add('is-nav-open');
    panelRef.current?.querySelector('a, button')?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        burgerRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll('a[href], button:not([disabled])');
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('is-nav-open');
    };
  }, [menuOpen]);

  // NavLink sets aria-current="page" on the active route; the active styling
  // keys off that attribute rather than an extra class.
  return (
    <>
      <a className="bx-skip-link" href="#main">
        {header.skipLink}
      </a>

      <m.header
        className="bx-header"
        data-tone={tone}
        data-state={state}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: duration.slow, ease: ease.entrance }}
      >
        <div className="bx-header__inner">
          <NavLink to="/" className="bx-brand" aria-label={`${site.name} — home`}>
            <img
              className="bx-brand__mark"
              src="/logo-mark.png"
              srcSet="/logo-mark.png 96w, /logo-mark@2x.png 192w"
              sizes="34px"
              width="96"
              height="96"
              alt={header.brandAlt}
            />
            <span className="bx-brand__name">
              <span className="bx-brand__word">BloomX</span>
              <span className="bx-brand__sub">Technologies</span>
            </span>
          </NavLink>

          <nav className="bx-nav" aria-label="Primary">
            {header.nav.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className="bx-nav__link">
                {item.label}
              </NavLink>
            ))}
          </nav>

          <NavLink to="/contact" className="bx-btn bx-btn--primary bx-btn--sm bx-header__cta">
            {header.cta}
          </NavLink>

          <button
            ref={burgerRef}
            type="button"
            className="bx-burger"
            aria-expanded={menuOpen}
            aria-controls="bx-mobile-nav"
            aria-label={menuOpen ? header.closeLabel : header.openLabel}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </m.header>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            id="bx-mobile-nav"
            ref={panelRef}
            className="bx-mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.entrance } }}
            exit={{ opacity: 0, y: -10, transition: { duration: duration.fast, ease: ease.exit } }}
          >
            <m.nav
              className="bx-mobile-nav__links"
              aria-label="Mobile"
              variants={cascade(stagger.tight, 0.06)}
              initial="hidden"
              animate="visible"
            >
              {header.nav.map((item, index) => (
                <m.div key={item.to} variants={riseIn}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className="bx-mobile-nav__link"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="bx-mobile-nav__index">{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </NavLink>
                </m.div>
              ))}
            </m.nav>

            <div className="bx-mobile-nav__footer">
              <NavLink
                to="/contact"
                className="bx-btn bx-btn--primary bx-btn--block"
                onClick={() => setMenuOpen(false)}
              >
                {header.cta}
              </NavLink>
              <div className="bx-mobile-nav__contact">
                <a href={`mailto:${footer.contact.email}`}>{footer.contact.email}</a>
                <a href={`tel:${footer.contact.phone.replace(/[^+\d]/g, '')}`}>{footer.contact.phone}</a>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
