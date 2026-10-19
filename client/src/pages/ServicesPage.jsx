import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import Section, { Reveal } from '../components/ui/Section';
import { ArrowIcon, CheckIcon, Eyebrow, SectionHeading, Tags } from '../components/ui/Primitives';
import Approach from '../sections/Approach';
import CtaBand from '../sections/CtaBand';
import siteContent from '../content/siteContent.json';
import { industries, services, technologyGroups } from '../content/catalog';
import { buildImage, media } from '../content/media';
import useDocumentMeta from '../utils/useDocumentMeta';

const copy = siteContent.services;

export default function ServicesPage() {
  useDocumentMeta({ ...copy.meta, path: '/services' });

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} text={copy.text}>
        <nav className="bx-page-hero__jump" aria-label="Services on this page">
          {services.map((service, index) => (
            <a className="bx-jump" key={service.slug} href={`#${service.slug}`}>
              <span className="bx-jump__num">{String(index + 1).padStart(2, '0')}</span>
              {service.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <Section tight>
        {services.map((service, index) => {
          const image = buildImage(media[service.mediaKey], {
            ratio: [4, 3],
            sizes: '(min-width: 960px) 44vw, 92vw',
            widths: [480, 720, 960, 1200]
          });

          return (
            <article className="bx-service" id={service.slug} key={service.slug}>
              <Reveal className="bx-service__media">
                <figure className="bx-figure bx-figure--zoom bx-service__figure">
                  <img {...image} />
                </figure>
              </Reveal>

              <Reveal className="bx-service__body" delay={0.06}>
                <Eyebrow>Service {String(index + 1).padStart(2, '0')}</Eyebrow>
                <h2 className="bx-service__title">{service.title}</h2>
                <p className="bx-lead">{service.description}</p>

                <div>
                  <p className="bx-label">{copy.deliverablesLabel}</p>
                  <ul className="bx-service__list">
                    {service.deliverables.map((item) => (
                      <li key={item}>
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="bx-label">{copy.stackLabel}</p>
                  <Tags items={service.stack} />
                </div>

                <div>
                  <Link
                    to={`/contact?service=${service.slug}`}
                    className="bx-btn bx-btn--ghost"
                  >
                    {copy.serviceCta}
                    <ArrowIcon />
                  </Link>
                </div>
              </Reveal>
            </article>
          );
        })}
      </Section>

      <Approach
        id="delivery"
        tone="sunken"
        copy={{
          eyebrow: copy.processEyebrow,
          title: copy.processTitle,
          text: siteContent.home.approach.text
        }}
      />

      <Section>
        <SectionHeading split eyebrow={copy.techEyebrow} title={copy.techTitle} text={copy.techText} />
        <div className="bx-grid bx-grid--2" style={{ marginTop: 'var(--space-10)' }}>
          {technologyGroups.map((group, index) => (
            <Reveal key={group.label} delay={index * 0.06} className="bx-panel bx-panel--sunken">
              <p className="bx-label">{group.label}</p>
              <Tags items={group.items} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="dark" tight>
        <div className="bx-split bx-split--5-7">
          <Reveal className="bx-stack bx-stack--sm">
            <Eyebrow>{copy.industryEyebrow}</Eyebrow>
            <h2>{copy.industryTitle}</h2>
          </Reveal>
          <Reveal delay={0.08} className="bx-stack">
            <p className="bx-lead">{copy.industryText}</p>
            <Tags items={industries} onDark />
          </Reveal>
        </div>
      </Section>

      <CtaBand secondaryTo="/work" />
    </>
  );
}
