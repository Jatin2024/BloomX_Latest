import { useRef } from 'react';
import { m, useScroll, useSpring } from 'framer-motion';
import Section, { Reveal } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/Primitives';
import { processSteps } from '../content/catalog';

/**
 * The one scroll-linked effect on the site: the timeline rule fills as the
 * section passes through the viewport. It is purely decorative — the steps
 * themselves are plain, readable content underneath.
 */
export default function Approach({ copy, tone = 'dark', id }) {
  const trackRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 80%', 'end 55%']
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });

  const isDark = tone === 'dark';

  return (
    <Section
      id={id}
      tone={tone}
      className={`bx-approach${isDark ? '' : ' bx-approach--light'}`}
      innerClassName="bx-approach__inner"
      aria-labelledby={`${id || 'approach'}-title`}
    >
      {isDark && <div className="bx-blueprint" aria-hidden="true" />}

      <SectionHeading
        split
        eyebrow={copy.eyebrow}
        title={copy.title}
        text={copy.text}
        level="h2"
      />

      <div className="bx-steps" ref={trackRef}>
        <div className="bx-steps__track" aria-hidden="true">
          {/* The axis flips between mobile (vertical rule) and desktop
              (horizontal rule), so the value is handed to CSS as a variable
              and each breakpoint picks the axis it needs. */}
          <m.div className="bx-steps__progress" style={{ '--bx-progress': progress }} />
        </div>

        {processSteps.map((step, index) => (
          <Reveal className="bx-step" key={step.title} delay={index * 0.06} y={16}>
            <span className="bx-step__node" aria-hidden="true" />
            <span className="bx-step__index">Step {String(index + 1).padStart(2, '0')}</span>
            <h3 className="bx-step__title">{step.title}</h3>
            <p className="bx-step__text">{step.text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
