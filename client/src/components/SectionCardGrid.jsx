import { motion } from 'framer-motion';

export default function SectionCardGrid({ items }) {
  return (
    <div className="row g-4 mt-4 interactive-grid">
      {items.map((item, index) => (
        <div className="col-md-6" key={item.title}>
          <motion.div
            className="interactive-card h-100 p-4 position-relative overflow-hidden animate-slide-up"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.55, delay: index * 0.1, ease: 'easeOut' }}
            whileHover={{ y: -10, scale: 1.01 }}
          >
            <div className="interactive-card-ring" />
            {item.icon && <div className="interactive-card-icon">{item.icon}</div>}
            <div className="interactive-card-content">
              {item.label && (
                <p className="text-uppercase text-success small fw-bold mb-2">{item.label}</p>
              )}
              <h5 className="mb-3">{item.title}</h5>
              <p className="text-muted mb-0">{item.description}</p>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
