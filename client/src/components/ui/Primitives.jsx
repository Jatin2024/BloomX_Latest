import { Link } from 'react-router-dom';

/* -------------------------------------------------------------------------
   Small shared primitives. Deliberately few variants — anything that needs
   a one-off look is composed from these rather than given a new class.
   ------------------------------------------------------------------------- */

export function Eyebrow({ children, plain = false, className = '', as: Tag = 'p' }) {
  return (
    <Tag className={`bx-eyebrow${plain ? ' bx-eyebrow--plain' : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </Tag>
  );
}

/**
 * Heading block: eyebrow + title + optional supporting text. `aside` turns
 * it into a two-column split with the text pushed to the right column.
 */
export function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'start',
  split = false,
  level: Level = 'h2',
  actions,
  className = ''
}) {
  const body = (
    <>
      <div className="bx-stack bx-stack--sm">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Level className="bx-heading__title">{title}</Level>
      </div>
      {(text || actions) && (
        <div className="bx-heading__aside bx-stack bx-stack--sm">
          {text && <p className="bx-lead">{text}</p>}
          {actions}
        </div>
      )}
    </>
  );

  const classes = [
    'bx-heading',
    split ? 'bx-heading--split' : '',
    align === 'center' ? 'bx-heading--center' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{body}</div>;
}

const BUTTON_VARIANTS = {
  primary: 'bx-btn--primary',
  ghost: 'bx-btn--ghost',
  onDark: 'bx-btn--on-dark',
  quiet: 'bx-btn--quiet'
};

function buttonClasses({ variant = 'primary', size, block, className }) {
  return [
    'bx-btn',
    BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary,
    size === 'lg' ? 'bx-btn--lg' : '',
    size === 'sm' ? 'bx-btn--sm' : '',
    block ? 'bx-btn--block' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');
}

/** Internal route button. */
export function ButtonLink({ to, variant, size, block, className = '', children, ...rest }) {
  return (
    <Link to={to} className={buttonClasses({ variant, size, block, className })} {...rest}>
      {children}
    </Link>
  );
}

/** External / mailto / tel button. */
export function ButtonAnchor({ href, variant, size, block, className = '', children, ...rest }) {
  return (
    <a href={href} className={buttonClasses({ variant, size, block, className })} {...rest}>
      {children}
    </a>
  );
}

export function Button({ variant, size, block, className = '', loading = false, children, ...rest }) {
  return (
    <button className={buttonClasses({ variant, size, block, className })} {...rest}>
      {loading && <span className="bx-btn__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function ArrowIcon({ size = 16 }) {
  return (
    <svg
      className="bx-arrow-link__icon"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

export function CheckIcon({ size = 14 }) {
  return (
    <svg
      className="bx-service__check"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 7.5 5.5 11 12 3.5" />
    </svg>
  );
}

export function ArrowLink({ to, href, children, className = '', ...rest }) {
  const content = (
    <>
      {children}
      <ArrowIcon />
    </>
  );
  const classes = `bx-arrow-link${className ? ` ${className}` : ''}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...rest}>
      {content}
    </a>
  );
}

export function Tags({ items, onDark = false, accent = false, className = '' }) {
  if (!items || !items.length) return null;
  return (
    <ul className={`bx-tags${className ? ` ${className}` : ''}`}>
      {items.map((item) => (
        <li
          key={item}
          className={`bx-tag${onDark ? ' bx-tag--on-dark' : ''}${accent ? ' bx-tag--accent' : ''}`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Image frame. Always renders with an explicit aspect ratio so nothing
 * reflows while the photograph loads.
 */
export function Figure({
  image,
  className = '',
  treatment = 'scrim',
  zoom = true,
  children
}) {
  const classes = [
    'bx-figure',
    treatment === 'scrim' ? 'bx-figure--scrim' : '',
    treatment === 'tinted' ? 'bx-figure--tinted' : '',
    zoom ? 'bx-figure--zoom' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <figure className={classes}>
      <img {...image} />
      {children}
    </figure>
  );
}
