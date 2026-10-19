import { ButtonLink } from '../components/ui/Primitives';
import siteContent from '../content/siteContent.json';
import useDocumentMeta from '../utils/useDocumentMeta';

const copy = siteContent.notFound;

export default function NotFoundPage() {
  useDocumentMeta(copy.meta);

  return (
    <section className="bx-notfound">
      <div className="bx-shell bx-shell--narrow bx-stack" style={{ justifyItems: 'center' }}>
        <p className="bx-notfound__code">{copy.code}</p>
        <h1>{copy.title}</h1>
        <p className="bx-lead">{copy.text}</p>
        <div className="bx-row" style={{ justifyContent: 'center' }}>
          <ButtonLink to="/">{copy.primary}</ButtonLink>
          <ButtonLink to="/contact" variant="ghost">
            {copy.secondary}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
