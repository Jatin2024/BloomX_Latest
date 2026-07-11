import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import siteContent from '../content/siteContent.json';
import HeroSection from '../components/HeroSection';
import HeroVisualCard from '../components/HeroVisualCard';
import AnimatedDisclosure from '../components/AnimatedDisclosure';
import SectionCardGrid from '../components/SectionCardGrid';
import FeatureGrid from '../components/FeatureGrid';
import ProcessSection from '../components/ProcessSection';
import { processSteps, industries, featureGroups } from '../components/DataSections';
import { fadeUpProps } from '../utils/motion';

export default function HomePage() {
  const [message, setMessage] = useState('Checking backend connectivity...');
  const { home } = siteContent;

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Backend not reachable'));
  }, []);

  return (
    <main>
      <HeroSection message={message} />

      <motion.section className="py-4 interactive-section" {...fadeUpProps}>
        <div className="row gx-4 gy-4 align-items-center">
          <div className="col-lg-6 order-lg-2">
            <motion.div className="card border-0 shadow-lg p-4 h-100 rounded-4" whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {home.whoBadges.map((badge) => (
                  <span key={badge} className="badge bg-success text-white rounded-pill py-2 px-3">{badge}</span>
                ))}
              </div>
              <h2 className="mb-3">{home.whoTitle}</h2>
              <p className="text-muted">{home.whoDescription}</p>
              <SectionCardGrid items={home.whoFeatures} />
            </motion.div>
          </div>
          <div className="col-lg-6 order-lg-1">
            <HeroVisualCard />
          </div>
        </div>
      </motion.section>

      <motion.section className="py-5 interactive-section" {...fadeUpProps}>
        <motion.div className="text-center mb-5" whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 22 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
          <h2>{home.serviceTitle}</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '680px' }}>{home.serviceDescription}</p>
        </motion.div>
        <SectionCardGrid items={home.serviceCards} />
      </motion.section>

      <FeatureGrid items={featureGroups} />

      <motion.section className="py-4 interactive-section" {...fadeUpProps}>
        <div className="row gx-4 gy-4 align-items-stretch why-layout">
          <div className="col-lg-7 col-xl-8">
            <motion.div className="card border-0 shadow-lg p-4 p-lg-5 rounded-4 h-100 why-card" whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.55, delay: 0.06, ease: 'easeOut' }}>
              <div className="section-eyebrow mb-3">Why BloomX</div>
              <div className="mb-4">
                <h2 className="mb-3">{home.whyTitle}</h2>
                <p className="text-muted mb-0 section-intro">{home.whyDescription}</p>
              </div>
              <div className="d-grid gap-3 why-disclosure-list">
                {home.whyBullets.map((bullet, index) => (
                  <AnimatedDisclosure
                    key={bullet.title}
                    defaultOpen={index === 0}
                    className="why-disclosure why-bullet-card animate-slide-up"
                    summaryClassName="disclosure-summary why-summary"
                    contentClassName="disclosure-content"
                    summary={(
                      <>
                        <div className="d-flex align-items-center gap-3 min-w-0">
                          <div className="why-bullet-icon">0{index + 1}</div>
                          <div className="min-w-0 text-start">
                            <h5 className="mb-1">{bullet.title}</h5>
                            <p className="mb-0 why-summary-text">Tap to expand</p>
                          </div>
                        </div>
                        <span className="disclosure-arrow">⌄</span>
                      </>
                    )}
                  >
                    <p className="mb-0 why-bullet-text">{bullet.description}</p>
                  </AnimatedDisclosure>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="col-lg-5 col-xl-4">
            <motion.div className="card border-0 shadow-lg p-4 p-lg-5 rounded-4 h-100 commitment-card" whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.55, delay: 0.16, ease: 'easeOut' }}>
              <div className="section-eyebrow mb-3">Our commitment</div>
              <h5 className="mb-3">What you can expect from us</h5>
              <p className="text-muted mb-4 commitment-intro">We keep delivery steady, communication clear, and outcomes focused on your business goals.</p>
              <div className="d-grid gap-3 commitment-list">
                {home.trustPrinciples.map((principle) => (
                  <div key={principle} className="commitment-pill">
                    <span>{principle}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <ProcessSection steps={processSteps} industries={industries} />

      <motion.section className="py-5 mt-4 cta-section" {...fadeUpProps}>
        <div className="row gx-4 gy-4 align-items-center">
          <motion.div className="col-lg-8" whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -20 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.55, ease: 'easeOut' }}>
            <div className="section-eyebrow mb-3">Start your project</div>
            <h2>{home.ctaTitle}</h2>
            <p className="text-muted cta-lead mb-0">{home.ctaDescription}</p>
          </motion.div>
          <motion.div className="col-lg-4 d-flex flex-column gap-3 cta-actions" whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 20 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}>
            <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <NavLink className="btn btn-success btn-lg w-100 cta-primary-btn" to="/contact">{home.ctaPrimary}</NavLink>
            </motion.div>
            <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <NavLink className="btn btn-outline-success btn-lg w-100 cta-secondary-btn" to="/contact">{home.ctaSecondary}</NavLink>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
