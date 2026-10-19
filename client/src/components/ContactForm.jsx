import { m } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import siteContent from '../content/siteContent.json';
import { fadeUpProps } from '../utils/motion';
import { buildApiUrl } from '../utils/api';
import { hasSuspiciousInput, sanitizeInput } from '../utils/inputSecurity';
import { validatePhoneNumber } from '../utils/phoneValidation';
import CountryCodeSelect from './CountryCodeSelect';
import { Button } from './ui/Primitives';
import { Field, FormToast, emailPattern } from './ui/FormBits';

const { contact } = siteContent;
const messages = contact.form.messages;

const EMPTY = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  message: ''
};

/**
 * Project enquiry form.
 *
 * The network contract is unchanged from the original implementation:
 * POST {API}/enquiry with { first_name, last_name, phone, email, message },
 * sanitised and length-capped exactly as before. Success is only ever shown
 * when the response is actually ok.
 */
export default function ContactForm({ initialMessage = '' }) {
  const [values, setValues] = useState({ ...EMPTY, message: initialMessage });
  const [countryCode, setCountryCode] = useState('IN');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  // Prefill from a service deep-link (/contact?service=apis) when provided.
  useEffect(() => {
    if (initialMessage) {
      setValues((current) => (current.message ? current : { ...current, message: initialMessage }));
    }
  }, [initialMessage]);

  useEffect(() => {
    if (!status) return undefined;
    const timeoutId = window.setTimeout(() => setStatus(''), 6000);
    return () => window.clearTimeout(timeoutId);
  }, [status]);

  const setValue = (key) => (event) => {
    const raw = event.target.value;
    const next = key === 'phone' ? raw.replace(/\D/g, '') : raw;
    setValues((current) => ({ ...current, [key]: next }));
    setErrors((current) => (current[key] ? { ...current, [key]: '' } : current));
  };

  const validate = () => {
    const next = {};
    const trimmed = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()])
    );

    if (!trimmed.firstName) next.firstName = messages.firstName;
    if (!trimmed.lastName) next.lastName = messages.lastName;
    if (!trimmed.email || !emailPattern.test(trimmed.email)) next.email = messages.email;
    if (!trimmed.message) next.message = messages.message;

    const phoneError = validatePhoneNumber(trimmed.phone, countryCode);
    if (phoneError) next.phone = phoneError;

    const unsafe = Object.values(trimmed).some((value) => hasSuspiciousInput(value));
    return { next, trimmed, unsafe };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const { next, trimmed, unsafe } = validate();

    if (unsafe) {
      setStatusType('error');
      setStatus(messages.unsafe);
      return;
    }

    if (Object.keys(next).length) {
      setErrors(next);
      setStatusType('error');
      setStatus(messages.required);
      const firstKey = Object.keys(next)[0];
      formRef.current?.querySelector(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const payload = {
      first_name: sanitizeInput(trimmed.firstName, 80),
      last_name: sanitizeInput(trimmed.lastName, 80),
      phone: sanitizeInput(trimmed.phone, 40),
      email: sanitizeInput(trimmed.email, 140),
      message: sanitizeInput(trimmed.message, 2000)
    };

    try {
      const response = await fetch(buildApiUrl('/enquiry'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));
      setStatusType(response.ok ? 'success' : 'error');
      setStatus(data.message || messages.requestFailed);

      if (response.ok) {
        setValues({ ...EMPTY });
        setCountryCode('IN');
      }
    } catch {
      setStatusType('error');
      setStatus(messages.network);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <FormToast status={status} type={statusType} onDismiss={() => setStatus('')} />

      <m.form ref={formRef} className="bx-form" onSubmit={handleSubmit} noValidate {...fadeUpProps}>
        <div className="bx-form__grid">
          <Field id="enquiry-first-name" label={contact.form.firstNameLabel} required error={errors.firstName}>
            {(aria) => (
              <input
                {...aria}
                name="firstName"
                className="bx-input"
                autoComplete="given-name"
                placeholder={contact.form.firstNamePlaceholder}
                value={values.firstName}
                onChange={setValue('firstName')}
              />
            )}
          </Field>

          <Field id="enquiry-last-name" label={contact.form.lastNameLabel} required error={errors.lastName}>
            {(aria) => (
              <input
                {...aria}
                name="lastName"
                className="bx-input"
                autoComplete="family-name"
                placeholder={contact.form.lastNamePlaceholder}
                value={values.lastName}
                onChange={setValue('lastName')}
              />
            )}
          </Field>
        </div>

        <div className="bx-form__grid">
          <Field id="enquiry-phone" label={contact.form.phoneLabel} required error={errors.phone}>
            {(aria) => (
              <div className="bx-phone">
                <CountryCodeSelect
                  id="enquiry-country"
                  value={countryCode}
                  onChange={setCountryCode}
                />
                <input
                  {...aria}
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  className="bx-input"
                  autoComplete="tel-national"
                  placeholder={contact.form.phonePlaceholder}
                  value={values.phone}
                  onChange={setValue('phone')}
                />
              </div>
            )}
          </Field>

          <Field id="enquiry-email" label={contact.form.emailLabel} required error={errors.email}>
            {(aria) => (
              <input
                {...aria}
                name="email"
                type="email"
                className="bx-input"
                autoComplete="email"
                placeholder={contact.form.emailPlaceholder}
                value={values.email}
                onChange={setValue('email')}
              />
            )}
          </Field>
        </div>

        <Field id="enquiry-message" label={contact.form.messageLabel} required error={errors.message}>
          {(aria) => (
            <textarea
              {...aria}
              name="message"
              className="bx-textarea"
              rows={6}
              placeholder={contact.form.messagePlaceholder}
              value={values.message}
              onChange={setValue('message')}
            />
          )}
        </Field>

        <div>
          <Button type="submit" size="lg" disabled={isSubmitting} aria-busy={isSubmitting} loading={isSubmitting}>
            {isSubmitting ? messages.submitting : contact.form.submitButton}
          </Button>
        </div>
      </m.form>
    </>
  );
}
