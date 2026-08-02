import { useState } from 'react';
import { motion } from 'framer-motion';
import { jobOpenings } from '../components/DataSections';
import JobApplicationForm from '../components/JobApplicationForm';
import PageHeader from '../components/PageHeader';
import siteContent from '../content/siteContent.json';
import { fadeUpProps } from '../utils/motion';

const { careers } = siteContent;

export default function CareersPage() {
  const [selectedPosition, setSelectedPosition] = useState(jobOpenings[0]?.title || '');

  return (
    <main>
      <motion.section className="py-4 interactive-section careers-hero-section" {...fadeUpProps}>
        <div className="row g-4 align-items-center">
          <div className="col-lg-7">
            <div className="section-eyebrow mb-3">{careers.heroEyebrow}</div>
            <PageHeader title={careers.pageTitle} subtitle={careers.subtitle} />
          </div>
          <div className="col-lg-5">
            <motion.div
              className="careers-spotlight-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <div className="careers-spotlight-tag">{careers.spotlightTag}</div>
              <h3>{careers.spotlightTitle}</h3>
              <p className="mb-0">{careers.spotlightDescription}</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="py-4">
        <div className="section-eyebrow mb-3">{careers.rolesEyebrow}</div>
        <div className="row g-4">
          {jobOpenings.map((job, index) => (
            <div className="col-md-6 col-lg-4" key={job.title}>
              <motion.div className="card h-100 shadow-sm border-0 careers-role-card" {...fadeUpProps} transition={{ ...fadeUpProps.transition, delay: index * 0.08 }} whileHover={{ y: -10, scale: 1.01 }}>
                <div className="card-body p-4">
                  <div className="careers-role-top mb-3">
                    <span className="careers-role-index">0{index + 1}</span>
                    <span className="careers-role-label">{careers.roleLabel}</span>
                  </div>
                  <h5>{job.title}</h5>
                  <p className="text-muted mb-4">{job.description}</p>
                  <a
                    href="#apply-form"
                    className="btn btn-outline-success careers-apply-btn"
                    onClick={() => setSelectedPosition(job.title)}
                  >
                    {careers.roleCta}
                  </a>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      <motion.section className="py-4 interactive-section careers-application-section" {...fadeUpProps} id="apply-form">
        <div className="row g-4 align-items-center">
          <div className="col-lg-5">
            <div className="careers-apply-intro rounded-4 p-4 p-lg-5 shadow-sm h-100">
              <div className="section-eyebrow mb-3">{careers.applicationEyebrow}</div>
              <h2>{careers.applyTitle}</h2>
              <p className="text-muted mb-3">{careers.applyDescription}</p>
              <p className="text-muted careers-company-copy mb-4">{careers.companyIntro}</p>

              <div className="careers-why-block mb-4">
                <h6 className="careers-why-title mb-3">{careers.whyApplyTitle}</h6>
                <ul className="careers-why-list mb-0">
                  {careers.whyApplyPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {careers.benefits.map((benefit) => (
                  <span key={benefit} className="careers-benefit-chip">{benefit}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="careers-form-shell rounded-4 p-4 p-lg-5 shadow-sm h-100">
              <JobApplicationForm
                positions={jobOpenings.map((job) => job.title)}
                selectedPosition={selectedPosition}
                onPositionChange={setSelectedPosition}
              />
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
