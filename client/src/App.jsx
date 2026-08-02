import { LazyMotion, MotionConfig, AnimatePresence, domAnimation, m } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import ScrollToTop from './components/ScrollToTop';
import siteContent from './content/siteContent.json';
import { pageTransitionProps } from './utils/motion';
import { useEffect } from 'react';

function App() {
  const location = useLocation();
  const { theme } = siteContent;

  useEffect(() => {
    const root = document.documentElement;
    const palette = theme?.palette || {};

    root.style.setProperty('--color-1', palette.background || '#F9F7F7');
    root.style.setProperty('--color-2', palette.surface || '#DBE2EF');
    root.style.setProperty('--color-3', palette.primary || '#3F72AF');
    root.style.setProperty('--color-4', palette.text || '#112D4E');
    root.style.setProperty('--color-3-rgb', palette.primaryRgb || '63, 114, 175');
    root.style.setProperty('--color-4-rgb', palette.textRgb || '17, 45, 78');
    root.style.setProperty('--bs-success', palette.primary || '#3F72AF');
    root.style.setProperty('--bs-success-rgb', palette.primaryRgb || '63, 114, 175');
  }, [theme]);

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <ScrollToTop />
        <div className="page">
          <SiteHeader />

          <main className="page-main container" style={{ paddingTop: '100px' }}>
            <AnimatePresence mode="wait">
              <m.div key={location.pathname} className="page-route" {...pageTransitionProps}>
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesPage />} />
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
