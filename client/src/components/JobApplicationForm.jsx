import { m } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import siteContent from '../content/siteContent.json';
import { buildApiUrl, readApiResponse } from '../utils/api';
import { fadeUpProps } from '../utils/motion';
import { hasSuspiciousInput, sanitizeInput } from '../utils/inputSecurity';
import { validatePhoneNumber } from '../utils/phoneValidation';
import CountryCodeSelect from './CountryCodeSelect';
import { Button } from './ui/Primitives';
import { Field, FormToast, emailPattern } from './ui/FormBits';

const { careers } = siteContent;
const messages = careers.form.messages;

const EMPTY = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  whyHire: ''
};

/**
 * Job application form.
 *
 * Network contract unchanged: multipart POST to {API}/apply carrying
 * position, first_name, last_name, phone, email, why_hire and the resume
 * file, with the same sanitisation and length caps as before.
 */
export default function JobApplicationForm({ positions = [], selectedPosition = '', onPositionChange }) {
  const [values, setValues] = useState(EMPTY);
  const [countryCode, setCountryCode] = useState('IN');
  const [position, setPosition] = useState(selectedPosition || positions[0] || '');
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (selectedPosition) setPosition(selectedPosition);
  }, [selectedPosition]);

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

  const handlePositionChange = (event) => {
    const next = event.target.value;
    setPosition(next);
    setErrors((current) => (current.position ? { ...current, position: '' } : current));
    if (onPositionChange) onPositionChange(next);
  };

  const handleFileChange = (event) => {
    setResumeFile(event.target.files?.[0] || null);
    setErrors((current) => (current.resume ? { ...current, resume: '' } : current));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmed = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()])
    );

    const next = {};
    if (!position) next.position = messages.position;
    if (!trimmed.firstName) next.firstName = messages.firstName;
    if (!trimmed.lastName) next.lastName = messages.lastName;
    if (!trimmed.email || !emailPattern.test(trimmed.email)) next.email = messages.email;
    if (!trimmed.whyHire) next.whyHire = messages.whyHire;
    if (!resumeFile) next.resume = messages.resume;

    const phoneError = validatePhoneNumber(trimmed.phone, countryCode);
    if (phoneError) next.phone = phoneError;

    if (Object.values(trimmed).some((value) => hasSuspiciousInput(value))) {
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

    const formData = new FormData();
    formData.append('position', position);
    formData.append('first_name', sanitizeInput(trimmed.firstName, 80));
    formData.append('last_name', sanitizeInput(trimmed.lastName, 80));
    formData.append('phone', sanitizeInput(trimmed.phone, 40));
    formData.append('email', sanitizeInput(trimmed.email, 140));
    formData.append('why_hire', sanitizeInput(trimmed.whyHire, 2000));
    formData.append('resume', resumeFile);

    try {
      const response = await fetch(buildApiUrl('/apply'), { method: 'POST', body: formData });
      // Success requires a 2xx *and* a JSON body — see readApiResponse.
      const { ok, message } = await readApiResponse(response);

      setStatusType(ok ? 'success' : 'error');
      setStatus(message || (ok ? messages.success : messages.requestFailed));

      if (ok) {
        setValues(EMPTY);
        setCountryCode('IN');
        setPosition(selectedPosition || positions[0] || '');
        setResumeFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
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
        <Field id="apply-position" label={careers.form.positionLabel} required error={errors.position}>
          {(aria) => (
            <select
              {...aria}
              name="position"
              className="bx-select"
              value={position}
              onChange={handlePositionChange}
            >
              {positions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          )}
        </Field>

        <div className="bx-form__grid">
          <Field id="apply-first-name" label={careers.form.firstNameLabel} required error={errors.firstName}>
            {(aria) => (
              <input
                {...aria}
                name="firstName"
                className="bx-input"
                autoComplete="given-name"
                placeholder={careers.form.firstNamePlaceholder}
                value={values.firstName}
                onChange={setValue('firstName')}
              />
            )}
          </Field>

          <Field id="apply-last-name" label={careers.form.lastNameLabel} required error={errors.lastName}>
            {(aria) => (
              <input
                {...aria}
                name="lastName"
                className="bx-input"
                autoComplete="family-name"
                placeholder={careers.form.lastNamePlaceholder}
                value={values.lastName}
                onChange={setValue('lastName')}
              />
            )}
          </Field>
        </div>

        <div className="bx-form__grid">
          <Field id="apply-phone" label={careers.form.phoneLabel} required error={errors.phone}>
            {(aria) => (
              <div className="bx-phone">
                <CountryCodeSelect id="apply-country" value={countryCode} onChange={setCountryCode} />
                <input
                  {...aria}
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  className="bx-input"
                  autoComplete="tel-national"
                  placeholder={careers.form.phonePlaceholder}
                  value={values.phone}
                  onChange={setValue('phone')}
                />
              </div>
            )}
          </Field>

          <Field id="apply-email" label={careers.form.emailLabel} required error={errors.email}>
            {(aria) => (
              <input
                {...aria}
                name="email"
                type="email"
                className="bx-input"
                autoComplete="email"
                placeholder={careers.form.emailPlaceholder}
                value={values.email}
                onChange={setValue('email')}
              />
            )}
          </Field>
        </div>

        <Field
          id="apply-resume"
          label={careers.form.resumeLabel}
          required
          error={errors.resume}
          hint={careers.form.resumeHint}
        >
          {(aria) => (
            <input
              {...aria}
              ref={fileInputRef}
              name="resume"
              type="file"
              className="bx-file-input"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
            />
          )}
        </Field>

        <Field id="apply-why" label={careers.form.whyHireLabel} required error={errors.whyHire}>
          {(aria) => (
            <textarea
              {...aria}
              name="whyHire"
              className="bx-textarea"
              rows={6}
              placeholder={careers.form.whyHirePlaceholder}
              value={values.whyHire}
              onChange={setValue('whyHire')}
            />
          )}
        </Field>

        <div>
          <Button type="submit" size="lg" disabled={isSubmitting} aria-busy={isSubmitting} loading={isSubmitting}>
            {isSubmitting ? messages.submitting : careers.form.submitButton}
          </Button>
        </div>
      </m.form>
    </>
  );
}
