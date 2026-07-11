import { motion } from 'framer-motion';
import { pageTransitionProps } from '../utils/motion';

export default function NotFoundPage() {
  return (
    <motion.main className="py-4" {...pageTransitionProps}>
      <div className="alert alert-warning">Page not found. Use the menu to navigate back.</div>
    </motion.main>
  );
}
