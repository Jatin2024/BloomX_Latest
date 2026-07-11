import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { easing } from '../utils/motion';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`navbar navbar-expand-lg navbar-light fixed-top site-navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: easing }}
    >
      <div className="container-fluid site-navbar-inner">
        <motion.div whileHover={{ y: -1 }}>
          <NavLink className="navbar-brand site-brand" to="/">
            <span className="site-brand-mark">BX</span>
            <span className="site-brand-text">BloomX</span>
          </NavLink>
        </motion.div>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navMenu"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navMenu">
          <div className="navbar-nav ms-auto align-items-center gap-2 gap-lg-3 site-nav-links">
            <motion.div whileHover={{ y: -1 }}><NavLink className={({ isActive }) => isActive ? 'nav-link site-nav-link site-nav-link-active' : 'nav-link site-nav-link'} to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></motion.div>
            <motion.div whileHover={{ y: -1 }}><NavLink className={({ isActive }) => isActive ? 'nav-link site-nav-link site-nav-link-active' : 'nav-link site-nav-link'} to="/services" onClick={() => setMenuOpen(false)}>Services</NavLink></motion.div>
            <motion.div whileHover={{ y: -1 }}><NavLink className={({ isActive }) => isActive ? 'nav-link site-nav-link site-nav-link-active' : 'nav-link site-nav-link'} to="/careers" onClick={() => setMenuOpen(false)}>Join Us</NavLink></motion.div>
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <NavLink className="nav-link site-nav-cta" to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
