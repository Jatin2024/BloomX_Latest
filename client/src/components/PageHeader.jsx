import { motion } from 'framer-motion';
import { fadeUpProps } from '../utils/motion';

export default function PageHeader({ title, subtitle }) {
  return (
    <motion.div className="mb-4" {...fadeUpProps}>
      <h2>{title}</h2>
      {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
    </motion.div>
  );
}
