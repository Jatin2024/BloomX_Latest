import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import Section, { Reveal } from '../components/ui/Section';
import { ArrowIcon, Eyebrow, Tags } from '../components/ui/Primitives';
import CtaBand from '../sections/CtaBand';
import siteContent from '../content/siteContent.json';
import { projects } from '../content/catalog';
import { buildImage, media } from '../content/media';
import useDocumentMeta from '../utils/useDocumentMeta';

const copy = siteContent.work;

export default function WorkPage() {
  useDocumentMeta({ ...copy.meta, path: '/work' });

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        text={copy.text}
        aside={<p className="bx-note">{copy.note}</p>}
      />

      <Section tight>
        {projects.map((project, index) => {
          const image = buildImage(media[project.mediaKey], {
            ratio: [16, 11],
            sizes: '(min-width: 960px) 52vw, 92vw',
            widths: [480, 768, 1024, 1440]
          });

          return (
            <article className="bx-work-row" key={project.slug}>
              <Reveal className="bx-work-row__media">
                <figure className="bx-figure bx-figure--zoom bx-work-row__figure">
                  <img {...image} />
                </figure>
              </Reveal>

              <Reveal className="bx-work-row__body" delay={0.06}>
                <Eyebrow>{String(index + 1).padStart(2, '0')} — {project.kind}</Eyebrow>
                <h2>{project.name}</h2>
                <p className="bx-lead">{project.summary}</p>

                <div className="bx-spec">
                  <div className="bx-spec__item">
                    <span className="bx-spec__key">{copy.typeLabel}</span>
                    <span className="bx-spec__value">{project.nature}</span>
                  </div>
                  <div className="bx-spec__item">
                    <span className="bx-spec__key">{copy.scopeLabel}</span>
                    <span className="bx-spec__value">{project.scope.join(' · ')}</span>
                  </div>
                  <div className="bx-spec__item">
                    <span className="bx-spec__key">{copy.stackLabel}</span>
                    <span className="bx-spec__value">
                      <Tags items={project.stack} />
                    </span>
                  </div>
                </div>

                <div>
                  <Link to="/contact" className="bx-btn bx-btn--ghost">
                    {copy.cta}
                    <ArrowIcon />
                  </Link>
                </div>
              </Reveal>
            </article>
          );
        })}
      </Section>

      <CtaBand secondaryTo="/services" />
    </>
  );
}
