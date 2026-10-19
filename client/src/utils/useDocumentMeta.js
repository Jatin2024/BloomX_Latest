import { useEffect } from 'react';

/**
 * Per-route document metadata without pulling in a helmet dependency.
 *
 * Canonical and og:url are built from the live origin, so they stay correct
 * on localhost, preview deployments and production alike — no domain is
 * hard-coded anywhere in the project.
 */

function setMeta(selector, attr, name, content) {
  if (!content) return;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setLink(rel, href) {
  if (!href) return;
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export default function useDocumentMeta({ title, description, path, image = '/og-image.png' }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const origin = window.location.origin;
    const url = `${origin}${path || window.location.pathname}`;
    const absoluteImage = image.startsWith('http') ? image : `${origin}${image}`;

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[property="og:image"]', 'property', 'og:image', absoluteImage);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absoluteImage);
    setLink('canonical', url);
  }, [title, description, path, image]);
}
