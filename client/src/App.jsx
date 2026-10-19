import { useEffect } from 'react';
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import WorkPage from './pages/WorkPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import ScrollToTop from './components/ScrollToTop';
import siteContent from './content/siteContent.json';
import { pageTransitionProps } from './utils/motion';

function App() {
  const location = useLocation();
  const { theme } = siteContent;

  // The brand palette stays configurable from content. These custom
  // properties are consumed as aliases inside styles/tokens.css.
  useEffect(() => {
    const root = document.documentElement;
    const palette = theme?.palette || {};

    root.style.setProperty('--color-1', palette.background || '#F9F7F7');
    root.style.setProperty('--color-2', palette.surface || '#DBE2EF');
    root.style.setProperty('--color-3', palette.primary || '#3F72AF');
    root.style.setProperty('--color-4', palette.text || '#112D4E');
    root.style.setProperty('--color-3-rgb', palette.primaryRgb || '63, 114, 175');
    root.style.setProperty('--color-4-rgb', palette.textRgb || '17, 45, 78');
  }, [theme]);

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <ScrollToTop />
        <div className="page">
          <SiteHeader />

          <main id="main" className="page-main">
            <AnimatePresence mode="wait">
              <m.div key={location.pathname} {...pageTransitionProps}>
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/work" element={<WorkPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </m.div>
            </AnimatePresence>
          </main>

          <SiteFooter />
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}

export default App;
