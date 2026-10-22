import { Link } from 'react-router-dom';
import { stagger } from '../utils/motion';
import PageHero from '../components/ui/PageHero';
import Section, { Reveal } from '../components/ui/Section';
import Media from '../components/ui/Media';
import {
  ArrowIcon,
  CheckIcon,
  DefList,
  Eyebrow,
  MetaLine,
  SectionHeading
} from '../components/ui/Primitives';
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
            widths: [480, 720, 960, 1200],
            desaturate: true
          });

          return (
            <article className="bx-service" id={service.slug} key={service.slug}>
              <Reveal className="bx-service__media">
                <Media image={image} className="bx-service__figure" duotone />
              </Reveal>

              <Reveal className="bx-service__body" delay={stagger.base}>
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
                  <MetaLine items={service.stack} lead />
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

      <Section className="bx-section--close">
        <SectionHeading
          variant="stacked"
          eyebrow={copy.techEyebrow}
          title={copy.techTitle}
          text={copy.techText}
        />
        <Reveal style={{ marginTop: 'clamp(2rem, 1.5rem + 2vw, 3.5rem)' }}>
          <DefList
            rows={technologyGroups.map((group) => ({
              key: group.label,
              value: group.items.join(' · ')
            }))}
          />
        </Reveal>
      </Section>

      <Section tone="dark" tight>
        <div className="bx-split bx-split--5-7">
          <Reveal className="bx-stack bx-stack--sm">
            <Eyebrow>{copy.industryEyebrow}</Eyebrow>
            <h2>{copy.industryTitle}</h2>
          </Reveal>
          <Reveal delay={stagger.loose} className="bx-stack">
            <p className="bx-lead">{copy.industryText}</p>
            <MetaLine items={industries} lead />
          </Reveal>
        </div>
      </Section>

      <CtaBand secondaryTo="/work" />
    </>
  );
}
