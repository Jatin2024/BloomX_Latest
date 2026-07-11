import { motion } from 'framer-motion';
import { easing } from '../utils/motion';

export default function HeroVisualCard() {
  return (
    <motion.div
      className="hero-visual-card position-relative rounded-4 overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: easing }}
      whileHover={{ y: -8 }}
    >
      <motion.img
        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80"
        alt="Team collaborating on technology design"
        className="img-fluid hero-detail-img"
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.55, ease: easing }}
      />
      <motion.div
        className="hero-overlay p-4 text-white"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.45, delay: 0.15, ease: easing }}
      >
        <span className="badge bg-success bg-opacity-25 mb-3">Platform design</span>
        <h5>Design that feels modern, reliable, and aligned with your product goals.</h5>
      </motion.div>
    </motion.div>
  );
}
