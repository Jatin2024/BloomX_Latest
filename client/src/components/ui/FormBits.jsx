import { AnimatePresence, m } from 'framer-motion';
import { duration, ease } from '../../utils/motion';

/* -------------------------------------------------------------------------
   Form building blocks shared by the enquiry and application forms.
   ------------------------------------------------------------------------- */

/**
 * Labelled field wrapper. Returns the aria plumbing the control needs via
 * the render prop so inputs stay correctly described without duplication.
 */
export function Field({ id, label, required = false, error, hint, children, className = '' }) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`bx-field${className ? ` ${className}` : ''}`}>
      <label className="bx-field__label" htmlFor={id}>
        {label}
        {required && (
          <span className="bx-field__req" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {typeof children === 'function'
        ? children({
            id,
            'aria-invalid': error ? 'true' : undefined,
            'aria-describedby': describedBy || undefined,
            'aria-required': required || undefined
          })
        : children}

      {hint && (
        <p className="bx-field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}

      <AnimatePresence initial={false}>
        {error && (
          <m.p
            className="bx-field__error"
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: duration.fast, ease: ease.ui }}
          >
            <WarnIcon />
            {error}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function WarnIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      style={{ flex: 'none', marginTop: '0.15em' }}
    >
      <circle cx="7" cy="7" r="5.75" />
      <path d="M7 4.3v3.2M7 9.7h.01" />
    </svg>
  );
}

/**
 * Submission feedback. Rendered in a fixed region so it is visible however
 * far down the form the user is, and announced politely to screen readers.
 * It is only ever shown after a real response — never optimistically.
 */
export function FormToast({ status, type = 'success', onDismiss }) {
  return (
    <div className="bx-toast-region" role="status" aria-live="polite">
      <AnimatePresence>
        {status && (
          <m.div
            key={status}
            className={`bx-toast bx-toast--${type === 'error' ? 'error' : 'success'}`}
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: duration.base, ease: ease.entrance }}
          >
            <span className="bx-toast__icon" aria-hidden="true">
              {type === 'error' ? <WarnIcon /> : <TickIcon />}
            </span>
            <span>{status}</span>
            {onDismiss && (
              <button type="button" className="bx-toast__close" onClick={onDismiss} aria-label="Dismiss message">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M2 2l8 8M10 2l-8 8" />
                </svg>
              </button>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TickIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ marginTop: '0.15em' }}
    >
      <path d="M2 7.4 5.4 10.8 12 4.2" />
    </svg>
  );
}

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
