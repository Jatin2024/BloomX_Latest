import Hero from '../sections/Hero';
import StudioIntro from '../sections/StudioIntro';
import CapabilityIndex from '../sections/CapabilityIndex';
import FeaturedWork from '../sections/FeaturedWork';
import Approach from '../sections/Approach';
import WhyBloomX from '../sections/WhyBloomX';
import CtaBand from '../sections/CtaBand';
import siteContent from '../content/siteContent.json';
import useDocumentMeta from '../utils/useDocumentMeta';

const { home } = siteContent;

export default function HomePage() {
  useDocumentMeta({ ...home.meta, path: '/' });

  return (
    <>
      <Hero />
      <StudioIntro />
      <CapabilityIndex />
      <FeaturedWork />
      <Approach copy={home.approach} tone="dark" id="approach" />
      <WhyBloomX />
      <CtaBand />
    </>
  );
}
