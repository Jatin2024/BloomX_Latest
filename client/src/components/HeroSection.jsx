import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import siteContent from '../content/siteContent.json';
import { easing, fadeUpProps } from '../utils/motion';

const { hero } = siteContent;

export default function HeroSection({ message }) {
  return (
    <motion.section className="py-5" {...fadeUpProps}>
      <div className="row align-items-center gy-4">
        <motion.div
          className="col-lg-7"
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: easing }}
        >
          <motion.span className="text-uppercase text-success fw-bold small" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: easing }}>{hero.eyebrow}</motion.span>
          <motion.h1 className="display-5 fw-bold mt-3" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.45, ease: easing }}>{hero.headline}</motion.h1>
          <motion.p className="lead text-muted" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.45, ease: easing }}>
            {hero.description}
          </motion.p>
          <motion.div className="d-flex flex-wrap gap-3 mt-4" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.45, ease: easing }}>
            <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <NavLink className="btn btn-success btn-lg" to="/contact">{hero.primaryButton}</NavLink>
            </motion.div>
            <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <NavLink className="btn btn-outline-success btn-lg" to="/services">{hero.secondaryButton}</NavLink>
            </motion.div>
          </motion.div>
          <motion.p className="text-success mt-4 mb-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.46, duration: 0.45, ease: easing }}>{hero.backendStatusPrefix} {message}</motion.p>
        </motion.div>
        <motion.div
          className="col-lg-5"
          initial={{ opacity: 0, x: 28, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12, ease: easing }}
        >
          <motion.div className="hero-visual rounded-4 shadow-lg overflow-hidden position-relative" whileHover={{ y: -8 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
            <motion.img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80"
              alt="Digital platform preview"
              className="img-fluid w-100 hero-visual-img"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease: easing }}
            />
            <motion.div className="hero-visual-caption p-4 text-white" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45, ease: easing }}>
              <span className="badge bg-success bg-opacity-25 mb-3">{hero.captionBadge}</span>
              <h5>{hero.captionText}</h5>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
