import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import siteContent from '../content/siteContent.json';
import { services, portfolio, industries, technologies } from '../components/DataSections';
import { fadeUpProps } from '../utils/motion';

const { services: servicesContent } = siteContent;

const serviceMeta = {
  'Digital experiences': { icon: '01', label: 'Customer touchpoints' },
  'Custom platforms': { icon: '02', label: 'Business systems' },
  'API solutions': { icon: '03', label: 'Connected workflows' },
  'Cloud engineering': { icon: '04', label: 'Infrastructure' }
};

const deliveryPillars = [
  {
    title: 'Strategy',
    subtitle: 'Business alignment',
    description: servicesContent.strategyDescription
  },
  {
    title: 'Design',
    subtitle: 'Premium product experiences',
    description: servicesContent.designDescription
  },
  {
    title: 'Delivery',
    subtitle: 'Launch with confidence',
    description: servicesContent.deliveryDescription
  }
];

export default function ServicesPage() {
  return (
    <main>
      <motion.section className="py-4 interactive-section services-hero-section" {...fadeUpProps}>
        <div className="row g-4 align-items-center">
          <div className="col-lg-7">
            <div className="section-eyebrow mb-3">{servicesContent.eyebrow}</div>
            <PageHeader title={servicesContent.pageTitle} subtitle="Scalable digital products, modern experiences, and reliable technical delivery designed to move your business forward." />
          </div>
          <div className="col-lg-5">
            <motion.div
              className="services-hero-card"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 24 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
            >
              <div className="services-hero-metric">{servicesContent.heroMetric}</div>
              <h3>{servicesContent.heroTitle}</h3>
              <p className="mb-0">{servicesContent.heroDescription}</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="py-4">
        <div className="row g-4">
          {services.map((service, index) => (
            <div className="col-md-6 col-lg-3" key={service.title}>
              <motion.div className="card h-100 shadow-sm border-0 services-card" {...fadeUpProps} transition={{ ...fadeUpProps.transition, delay: index * 0.08 }} whileHover={{ y: -10, scale: 1.01 }}>
                <div className="card-body p-4 p-xl-4">
                  <div className="services-card-top mb-4">
                    <span className="services-card-icon">{serviceMeta[service.title]?.icon || '00'}</span>
                    <span className="services-card-label">{serviceMeta[service.title]?.label || 'Solution'}</span>
                  </div>
                  <h5>{service.title}</h5>
                  <p className="text-muted mb-0">{service.description}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      <motion.section className="py-4 interactive-section services-pillars-section" {...fadeUpProps}>
        <div className="text-center mb-5">
          <div className="section-eyebrow mb-3">{servicesContent.deliveryEyebrow}</div>
          <h2 className="mb-3">{servicesContent.deliveryTitle}</h2>
        </div>
        <div className="row g-4">
          {deliveryPillars.map((pillar, index) => (
            <div className="col-lg-4" key={pillar.title}>
              <motion.div className="card h-100 border-0 shadow-sm p-4 services-pillar-card" {...fadeUpProps} transition={{ ...fadeUpProps.transition, delay: index * 0.1 }} whileHover={{ y: -8 }}>
                <div className="services-pillar-index mb-3">0{index + 1}</div>
                <h5 className="mb-2">{pillar.title}</h5>
                <p className="services-pillar-subtitle mb-3">{pillar.subtitle}</p>
                <p className="text-muted mb-0">{pillar.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.section>

      <section className="py-4 interactive-section services-portfolio-section">
        <PageHeader title={servicesContent.portfolioTitle} />
        <div className="row g-4">
          {portfolio.map((item, index) => (
            <div className="col-md-6 col-lg-4" key={item.title}>
              <motion.div {...fadeUpProps} transition={{ ...fadeUpProps.transition, delay: index * 0.1 }} whileHover={{ y: -10, scale: 1.01 }}>
                <NavLink to="/contact#contact-form" className="services-portfolio-link">
                  <div className="card h-100 shadow-sm border-0 overflow-hidden services-portfolio-card">
                    <img src={item.image} className="card-img-top services-portfolio-image" alt={item.title} loading="lazy" />
                    <div className="card-body p-4">
                      <div className="services-card-label mb-3">{servicesContent.portfolioBadge}</div>
                      <h5>{item.title}</h5>
                      <p className="text-muted mb-3">{item.description}</p>
                      <span className="services-portfolio-cta">{servicesContent.portfolioCta}</span>
                    </div>
                  </div>
                </NavLink>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      <motion.section className="py-4 interactive-section services-ecosystem-section" {...fadeUpProps}>
        <div className="row g-4 align-items-start">
          <div className="col-lg-5">
            <div className="section-eyebrow mb-3">{servicesContent.ecosystemEyebrow}</div>
            <h2 className="mb-3">{servicesContent.industryTitle}</h2>
            <p className="text-muted mb-0 services-ecosystem-copy">{servicesContent.industryDescription}</p>
          </div>
          <div className="col-lg-7">
            <div className="d-flex flex-wrap gap-2 services-chip-cloud">
              {industries.map((industry) => (
                <span key={industry} className="industry-pill services-chip-pill">{industry}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="py-4 interactive-section services-tech-section" {...fadeUpProps}>
        <PageHeader title={servicesContent.technologyTitle} />
        <div className="d-flex flex-wrap gap-2 services-chip-cloud">
          {technologies.map((tech) => (
            <span key={tech} className="industry-pill services-chip-pill">{tech}</span>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
