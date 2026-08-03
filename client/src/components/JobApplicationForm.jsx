import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import siteContent from '../content/siteContent.json';
import { buildApiUrl } from '../utils/api';
import { fadeUpProps } from '../utils/motion';
import { hasSuspiciousInput, sanitizeInput } from '../utils/inputSecurity';
import { validatePhoneNumber } from '../utils/phoneValidation';
import CountryCodeSelect from './CountryCodeSelect';

const { careers } = siteContent;

export default function JobApplicationForm({ positions = [], selectedPosition = '', onPositionChange }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState(selectedPosition || positions[0] || '');
  const [resumeFile, setResumeFile] = useState(null);
  const [whyHire, setWhyHire] = useState('');
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedPosition) {
      setPosition(selectedPosition);
    }
  }, [selectedPosition]);

  useEffect(() => {
    if (!status) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setStatus('');
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedWhyHire = whyHire.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedPhone || !trimmedEmail || !trimmedWhyHire || !position || !resumeFile) {
      setStatusType('error');
      setStatus(careers.form.messages.required);
      return;
    }

    if (
      hasSuspiciousInput(trimmedFirstName) ||
      hasSuspiciousInput(trimmedLastName) ||
      hasSuspiciousInput(trimmedPhone) ||
      hasSuspiciousInput(trimmedEmail) ||
      hasSuspiciousInput(trimmedWhyHire)
    ) {
      setStatusType('error');
      setStatus(careers.form.messages.unsafe);
      return;
    }

    const phoneError = validatePhoneNumber(trimmedPhone, countryCode);
    if (phoneError) {
      setStatusType('error');
      setStatus(phoneError);
      return;
    }

    const formData = new FormData();
    formData.append('position', position);
    formData.append('first_name', sanitizeInput(trimmedFirstName, 80));
    formData.append('last_name', sanitizeInput(trimmedLastName, 80));
    formData.append('phone', sanitizeInput(trimmedPhone, 40));
    formData.append('email', sanitizeInput(trimmedEmail, 140));
    formData.append('why_hire', sanitizeInput(trimmedWhyHire, 2000));
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(buildApiUrl('/apply'), {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setStatusType(res.ok ? 'success' : 'error');
      setStatus(data.message || careers.form.messages.requestFailed);

      if (res.ok) {
        setFirstName('');
        setLastName('');
        setPhone('');
        setCountryCode('US');
        setEmail('');
        setPosition(selectedPosition || positions[0] || '');
        setResumeFile(null);
        setWhyHire('');
        e.target.reset();
      }
    } catch {
      setStatusType('error');
      setStatus(careers.form.messages.network);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePositionChange = (value) => {
    setPosition(value);
    if (onPositionChange) {
      onPositionChange(value);
    }
  };

  return (
    <motion.form onSubmit={handleSubmit} className="row g-3 application-form" {...fadeUpProps}>
      {status && (
        <div className={`form-toast form-toast-${statusType === 'error' ? 'error' : 'success'}`} role="status" aria-live="polite">
          {status}
        </div>
      )}
      <div className="col-12">
        <label className="form-label">{careers.form.positionLabel} <span className="text-danger">*</span></label>
        <select
          value={position}
          onChange={(e) => handlePositionChange(e.target.value)}
          className="form-select application-form-control"
          required
        >
          {positions.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label">{careers.form.firstNameLabel} <span className="text-danger">*</span></label>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control application-form-control" placeholder={careers.form.firstNamePlaceholder} required />
      </div>
      <div className="col-md-6">
        <label className="form-label">{careers.form.lastNameLabel} <span className="text-danger">*</span></label>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control application-form-control" placeholder={careers.form.lastNamePlaceholder} required />
      </div>
      <div className="col-md-6">
        <label className="form-label">{careers.form.phoneLabel} <span className="text-danger">*</span></label>
        <div className="d-flex gap-2">
          <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} className="form-control application-form-control" placeholder={careers.form.phonePlaceholder} required />
        </div>
      </div>
      <div className="col-md-6">
        <label className="form-label">{careers.form.emailLabel} <span className="text-danger">*</span></label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control application-form-control" placeholder={careers.form.emailPlaceholder} required />
      </div>
      <div className="col-12">
        <label className="form-label">{careers.form.resumeLabel} <span className="text-danger">*</span></label>
        <input type="file" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} className="form-control application-form-control" required />
      </div>
      <div className="col-12">
        <label className="form-label">{careers.form.whyHireLabel} <span className="text-danger">*</span></label>
        <textarea value={whyHire} onChange={(e) => setWhyHire(e.target.value)} className="form-control application-form-control" placeholder={careers.form.whyHirePlaceholder} rows={5} required />
      </div>
      <div className="col-12">
        <motion.button
          type="submit"
          className="btn btn-success btn-lg job-submit-btn"
          whileHover={isSubmitting ? undefined : { y: -2, scale: 1.01 }}
          whileTap={isSubmitting ? undefined : { scale: 0.99 }}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <span className="d-inline-flex align-items-center gap-2">
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              {careers.form.messages.submitting || 'Submitting...'}
            </span>
          ) : (
            careers.form.submitButton
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
