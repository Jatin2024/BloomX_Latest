import { Link } from 'react-router-dom';
import Section, { Reveal } from '../components/ui/Section';
import { ArrowLink, SectionHeading, Tags } from '../components/ui/Primitives';
import siteContent from '../content/siteContent.json';
import { projects } from '../content/catalog';
import { buildImage, media } from '../content/media';

const copy = siteContent.home.work;

const FEATURE_SIZES = '(min-width: 880px) 56vw, 92vw';
const COMPACT_SIZES = '(min-width: 880px) 42vw, 92vw';

export default function FeaturedWork() {
  return (
    <Section aria-labelledby="work-title">
      <SectionHeading
        split
        eyebrow={copy.eyebrow}
        title={copy.title}
        text={copy.text}
        actions={<ArrowLink to="/work">{copy.cta}</ArrowLink>}
      />

      <div className="bx-work-grid" style={{ marginTop: 'var(--space-10)' }}>
        {projects.map((project, index) => {
          const isFeature = index === 0;
          const image = buildImage(media[project.mediaKey], {
            ratio: isFeature ? [16, 9] : [16, 10],
            sizes: isFeature ? FEATURE_SIZES : COMPACT_SIZES,
            widths: [480, 768, 1024, 1440]
          });

          return (
            <Reveal
              key={project.slug}
              delay={index * 0.07}
              y={18}
              className={`bx-work-cell${isFeature ? ' bx-work-cell--feature' : ''}`}
            >
              <Link
                to="/work"
                className={`bx-work-card${isFeature ? ' bx-work-card--feature' : ''}`}
              >
                <figure className="bx-figure bx-figure--zoom bx-work-card__figure">
                  <img {...image} />
                </figure>

                <div className="bx-work-card__body">
                  <p className="bx-work-card__kicker">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <b>{project.kind}</b>
                  </p>
                  <h3 className="bx-work-card__title">{project.name}</h3>
                  <p className="bx-work-card__text">{project.summary}</p>
                  <Tags items={project.scope} />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
