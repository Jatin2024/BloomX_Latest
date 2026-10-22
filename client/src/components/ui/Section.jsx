import { m } from 'framer-motion';
import { duration, ease, viewport } from '../../utils/motion';

const TONE_CLASS = {
  default: '',
  sunken: 'bx-section--sunken',
  mist: 'bx-section--mist',
  dark: 'bx-section--dark'
};

/**
 * Full-bleed band. Owns its own background tone and vertical rhythm; the
 * inner shell constrains the content width. Sections — not the app shell —
 * are what make alternating light/dark bands possible.
 */
export default function Section({
  id,
  as: Tag = 'section',
  tone = 'default',
  tight = false,
  ruleTop = false,
  shell = 'default',
  className = '',
  innerClassName = '',
  children,
  ...rest
}) {
  const classes = [
    'bx-section',
    TONE_CLASS[tone] || '',
    tight ? 'bx-section--tight' : '',
    ruleTop ? 'bx-section--rule-top' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const shellClasses = [
    'bx-shell',
    shell === 'wide' ? 'bx-shell--wide' : '',
    shell === 'narrow' ? 'bx-shell--narrow' : '',
    innerClassName
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag id={id} className={classes} {...rest}>
      <div className={shellClasses}>{children}</div>
    </Tag>
  );
}

/**
 * A block that fades up once, the first time it scrolls into view.
 *
 * Fires once and never re-animates on scroll-back — repeating entrances as
 * the reader moves up and down the page is the single most distracting
 * thing a reveal can do. Under reduced motion MotionConfig strips the
 * translate and this becomes a plain fade.
 */
export function Reveal({ as = 'div', className = '', children, delay = 0, y = 18, ...rest }) {
  const Component = m[as] || m.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: duration.slow, ease: ease.entrance, delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}
