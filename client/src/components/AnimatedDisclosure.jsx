import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AnimatedDisclosure({
  defaultOpen = false,
  className = '',
  summaryClassName = '',
  contentClassName = '',
  summary,
  children
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      className={className}
      initial={false}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      <motion.button
        type="button"
        className={summaryClassName}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        whileTap={{ scale: 0.995 }}
      >
        {summary}
      </motion.button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            className={contentClassName}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <motion.div
              className="disclosure-inner"
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -8 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}