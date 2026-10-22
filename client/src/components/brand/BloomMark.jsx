import { m } from 'framer-motion';
import { duration, ease } from '../../utils/motion';

/**
 * Brand lattice — an abstract redraw of the BloomX emblem: the two-tone X,
 * the surrounding ring and the circuit traces from the logo, rendered as
 * strokes that draw themselves in once on mount.
 *
 * Decorative only (aria-hidden). Animation is transform/stroke based, and
 * MotionConfig's reducedMotion="user" collapses it to its final state for
 * anyone who has asked for less movement.
 */

const drawTransition = (delay) => ({
  pathLength: { duration: duration.slower, ease: ease.entrance, delay },
  opacity: { duration: duration.base, delay }
});

const TRACES = [
  { d: 'M8 150 H44 L60 134 H92', node: [92, 134] },
  { d: 'M8 196 H30 L46 212 H80', node: [80, 212] },
  { d: 'M292 110 H262 L246 126 H214', node: [214, 126] },
  { d: 'M292 232 H256 L240 216 H206', node: [206, 216] }
];

export default function BloomMark({ className = '', animate = true }) {
  const draw = animate
    ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 } }
    : { initial: false };

  return (
    <svg
      className={className}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="bx-mark-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6B99CF" />
          <stop offset="100%" stopColor="#3F72AF" />
        </linearGradient>
        <linearGradient id="bx-mark-navy" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B3C63" />
          <stop offset="100%" stopColor="#0B1F38" />
        </linearGradient>
      </defs>

      {/* Seal backing: separates the mark from whatever sits behind it */}
      <circle cx="150" cy="150" r="142" fill="rgba(7, 21, 42, 0.42)" />

      {/* Emblem rings */}
      <m.circle
        cx="150"
        cy="150"
        r="142"
        stroke="rgba(107, 153, 207, 0.32)"
        strokeWidth="1"
        {...draw}
        transition={drawTransition(0)}
      />
      <m.circle
        cx="150"
        cy="150"
        r="128"
        stroke="rgba(107, 153, 207, 0.55)"
        strokeWidth="1"
        strokeDasharray="4 7"
        {...draw}
        transition={drawTransition(0.06)}
      />

      {/* Circuit traces, as on the emblem's outer band */}
      {TRACES.map((trace, index) => (
        <g key={trace.d}>
          <m.path
            d={trace.d}
            stroke="rgba(107, 153, 207, 0.6)"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...draw}
            transition={drawTransition(0.16 + index * 0.05)}
          />
          <m.circle
            cx={trace.node[0]}
            cy={trace.node[1]}
            r="2.6"
            fill="#6B99CF"
            initial={animate ? { opacity: 0, scale: 0 } : false}
            animate={animate ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: duration.base, ease: ease.entrance, delay: 0.52 + index * 0.05 }}
            style={{ transformOrigin: `${trace.node[0]}px ${trace.node[1]}px` }}
          />
        </g>
      ))}

      {/* The X: two offset bars, navy behind, blue in front */}
      <m.path
        d="M206 62 H246 L96 238 H56 Z"
        fill="url(#bx-mark-navy)"
        stroke="rgba(107, 153, 207, 0.4)"
        strokeWidth="1"
        initial={animate ? { opacity: 0, y: 14 } : false}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: duration.slow, ease: ease.entrance, delay: 0.18 }}
      />
      <m.path
        d="M54 62 H94 L244 238 H204 Z"
        fill="url(#bx-mark-blue)"
        initial={animate ? { opacity: 0, y: 14 } : false}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: duration.slow, ease: ease.entrance, delay: 0.26 }}
      />

      {/* Bloom: three leaves above the crossing, as in the logo */}
      <m.g
        initial={animate ? { opacity: 0, scale: 0.7 } : false}
        animate={animate ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: duration.slow, ease: ease.entrance, delay: 0.44 }}
        style={{ transformOrigin: '150px 122px' }}
      >
        {[-34, 0, 34].map((angle) => (
          <path
            key={angle}
            d="M0 0C7 -11 7 -22 0 -30C-7 -22 -7 -11 0 0Z"
            fill="#DBE2EF"
            transform={`translate(150 122) rotate(${angle})`}
          />
        ))}
      </m.g>
    </svg>
  );
}
