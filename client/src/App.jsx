import { LazyMotion, MotionConfig, AnimatePresence, domAnimation, m } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { pageTransitionProps } from './utils/motion';

function App() {
  const location = useLocation();

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
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
