import { motion } from 'framer-motion';

export default function FeatureGrid({ items }) {
  return (
    <section className="py-4">
      <div className="row g-4">
        {items.map((item, index) => (
          <div className="col-md-4" key={item.title}>
            <motion.div
              className="card h-100 border-0 shadow-sm p-4 info-group-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.12, ease: 'easeOut' }}
              whileHover={{ y: -12, scale: 1.015 }}
            >
              <div className="feature-header-row mb-4">
                <span className="feature-group-icon">{item.icon}</span>
                <span className="feature-group-title">{item.title}</span>
                <span className="feature-group-eyebrow">{item.eyebrow}</span>
              </div>
              <h5 className="fw-bold">{item.mainHeading}</h5>
              <p className="text-muted">{item.mainDescription}</p>
              {item.highlights && item.highlights.length > 0 && (
                <div className="d-flex flex-wrap gap-2 my-4">
                  {item.highlights.map((highlight) => (
                    <span key={highlight} className="feature-chip">{highlight}</span>
                  ))}
                </div>
              )}
              <div className="divider my-4" />
              <h6 className="fw-semibold mb-2">{item.subHeading}</h6>
              <p className="text-muted mb-0">{item.subDescription}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
