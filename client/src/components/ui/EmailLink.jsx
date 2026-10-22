import { useEffect, useRef, useState } from 'react';
import siteContent from '../../content/siteContent.json';

const { forms } = siteContent;

/**
 * Email address as a mailto link with a copy-to-clipboard fallback.
 *
 * A bare `mailto:` is silently inert for anyone without a registered mail
 * handler — on macOS with no Mail.app, or in Chrome where Gmail has not been
 * granted the mailto protocol, clicking does nothing at all and the visitor
 * assumes the site is broken. The copy control guarantees the address can
 * always be captured, whatever the machine is configured to do.
 */
export default function EmailLink({ email, subject, onDark = false, className = '' }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const href = subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;

  const copy = async () => {
    let ok = false;

    try {
      // Only available in a secure context (https / localhost).
      await navigator.clipboard.writeText(email);
      ok = true;
    } catch {
      // Fallback for insecure contexts and older browsers.
      try {
        const field = document.createElement('textarea');
        field.value = email;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        ok = document.execCommand('copy');
        document.body.removeChild(field);
      } catch {
        ok = false;
      }
    }

    if (!ok) return;

    setCopied(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <span className={`bx-email${onDark ? ' bx-email--on-dark' : ''}${className ? ` ${className}` : ''}`}>
      <a className="bx-email__address" href={href}>
        {email}
      </a>

      <button
        type="button"
        className="bx-email__copy"
        onClick={copy}
        aria-label={`${forms.copyEmail}: ${email}`}
      >
        {copied ? (
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 7.4 5.4 10.8 12 4.2" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
            <rect x="4.6" y="4.6" width="7.9" height="7.9" rx="1.4" />
            <path d="M9.6 2.1H3a1.4 1.4 0 0 0-1.4 1.4v6.6" />
          </svg>
        )}
        <span className="bx-email__copy-label">{copied ? forms.copied : forms.copy}</span>
      </button>

      {/* Announced to screen readers without stealing focus. */}
      <span className="bx-visually-hidden" role="status" aria-live="polite">
        {copied ? forms.copiedAnnouncement : ''}
      </span>
    </span>
  );
}
