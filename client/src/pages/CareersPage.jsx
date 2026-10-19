import { useRef, useState } from 'react';
import PageHero from '../components/ui/PageHero';
import Section, { Reveal } from '../components/ui/Section';
import { ArrowIcon, CheckIcon, Eyebrow, SectionHeading, Tags } from '../components/ui/Primitives';
import JobApplicationForm from '../components/JobApplicationForm';
import siteContent from '../content/siteContent.json';
import { jobOpenings } from '../content/catalog';
import { buildImage, media } from '../content/media';
import useDocumentMeta from '../utils/useDocumentMeta';

const copy = siteContent.careers;

const cultureImage = buildImage(media.teamSession, {
  ratio: [16, 10],
  sizes: '(min-width: 980px) 38vw, 92vw',
  widths: [480, 720, 960]
});

export default function CareersPage() {
  useDocumentMeta({ ...copy.meta, path: '/careers' });

  const [selectedPosition, setSelectedPosition] = useState(jobOpenings[0]?.title || '');
  const formRef = useRef(null);

  const applyTo = (title) => {
    setSelectedPosition(title);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => {
      formRef.current?.querySelector('select, input')?.focus({ preventScroll: true });
    }, 420);
  };

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        text={copy.text}
        aside={<Tags items={copy.benefits} accent />}
      />

      <Section tight>
        <SectionHeading eyebrow={copy.rolesEyebrow} title={copy.rolesTitle} />

        <div className="bx-rows" style={{ marginTop: 'var(--space-8)' }}>
          {jobOpenings.map((job, index) => (
            <Reveal className="bx-role" key={job.title} delay={index * 0.06} y={14}>
              <span className="bx-capability__index">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="bx-role__title">{job.title}</h3>
              <p className="bx-role__text">{job.description}</p>
              <div>
                <button type="button" className="bx-btn bx-btn--ghost bx-btn--sm" onClick={() => applyTo(job.title)}>
                  {copy.roleCta}
                  <ArrowIcon />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="sunken" id="apply-form">
        <div className="bx-contact__grid">
          <Reveal className="bx-contact__aside">
            <div className="bx-stack bx-stack--sm">
              <Eyebrow>{copy.applyEyebrow}</Eyebrow>
              <h2>{copy.applyTitle}</h2>
              <p className="bx-lead">{copy.applyText}</p>
            </div>

            <figure className="bx-figure bx-figure--zoom" style={{ aspectRatio: '16 / 10', borderRadius: 'var(--r-md)' }}>
              <img {...cultureImage} />
            </figure>

            <div>
              <h3 className="bx-label">{copy.whyTitle}</h3>
              <ul className="bx-service__list">
                {copy.whyPoints.map((point) => (
                  <li key={point}>
                    <CheckIcon />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div ref={formRef}>
            <Reveal className="bx-form-panel" delay={0.08}>
              <JobApplicationForm
                positions={jobOpenings.map((job) => job.title)}
                selectedPosition={selectedPosition}
                onPositionChange={setSelectedPosition}
              />
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
