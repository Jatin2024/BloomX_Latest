import { motion } from 'framer-motion';
import AnimatedDisclosure from './AnimatedDisclosure';
import { fadeUpProps } from '../utils/motion';

export default function ProcessSection({ steps, industries }) {
  return (
    <motion.section className="py-4 interactive-section" {...fadeUpProps}>
      <div className="row gx-4 gy-4 align-items-stretch">
        <div className="col-lg-6">

          {/* gdgjhcdgghdc */}
          <motion.div className="process-panel h-100 p-4 p-lg-5 rounded-4 shadow-lg" whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.55, delay: 0.05, ease: 'easeOut' }}>
            <div className="d-flex align-items-center justify-content-between gap-3 mb-4 flex-nowrap">
              <div>
                <div className="section-eyebrow mb-3">Our process</div>
                <h4 className="mb-2 process-heading">A streamlined process that keeps projects moving.</h4>
                <p className="text-muted mb-0">Open each step to see how we move from discovery to delivery.</p>
              </div>
              <span className="process-badge">Fast, clear, reliable</span>
            </div>
            <div className="d-grid gap-3 mt-4">
              {steps.map((item, index) => (
                <AnimatedDisclosure
                  key={item.step}
                  defaultOpen={index === 0}
                  className="process-disclosure process-card animate-slide-up"
                  summaryClassName="disclosure-summary process-summary"
                  contentClassName="disclosure-content"
                  summary={(
                    <>
                      <div className="d-flex align-items-center gap-3 min-w-0">
                        <div className="process-step-badge">0{index + 1}</div>
                        <div className="min-w-0 text-start">
                          <h5 className="mb-1">{item.step}</h5>
                          <p className="text-muted mb-0 process-summary-text">Step {index + 1}</p>
                        </div>
                      </div>
                      <span className="disclosure-arrow">⌄</span>
                    </>
                  )}
                >
                  <p className="text-muted mb-0">{item.description}</p>
                </AnimatedDisclosure>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="col-lg-6">
          <motion.div className="industries-panel h-100 p-4 p-lg-5 rounded-4 shadow-lg" whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.55, delay: 0.14, ease: 'easeOut' }}>
            <AnimatedDisclosure
              defaultOpen
              className="industry-disclosure"
              summaryClassName="disclosure-summary industries-summary"
              contentClassName="disclosure-content pt-4"
              summary={(
                <>
                  <div className="text-start">
                    <div className="section-eyebrow mb-3">Industries we serve</div>
                    <h4 className="mb-0 industry-heading">Industries we support</h4>
                  </div>
                  <span className="disclosure-arrow">⌄</span>
                </>
              )}
            >
              <p className="text-muted mb-3">A quick view of the sectors we commonly support.</p>
              <div className="d-flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <span key={industry} className="industry-pill">{industry}</span>
                ))}
              </div>
            </AnimatedDisclosure>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
