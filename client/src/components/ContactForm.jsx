import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import siteContent from '../content/siteContent.json';
import { fadeUpProps } from '../utils/motion';
import { buildApiUrl } from '../utils/api';
import { hasSuspiciousInput, sanitizeInput } from '../utils/inputSecurity';
import { validatePhoneNumber } from '../utils/phoneValidation';
import CountryCodeSelect from './CountryCodeSelect';

const { contact } = siteContent;

export default function ContactForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('success');

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

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedPhone || !trimmedEmail || !trimmedMessage) {
      setStatusType('error');
      setStatus(contact.form.messages.required);
      return;
    }

    if (
      hasSuspiciousInput(trimmedFirstName) ||
      hasSuspiciousInput(trimmedLastName) ||
      hasSuspiciousInput(trimmedPhone) ||
      hasSuspiciousInput(trimmedEmail) ||
      hasSuspiciousInput(trimmedMessage)
    ) {
      setStatusType('error');
      setStatus(contact.form.messages.unsafe);
      return;
    }

    const phoneError = validatePhoneNumber(trimmedPhone, countryCode);
    if (phoneError) {
      setStatusType('error');
      setStatus(phoneError);
      return;
    }

    const payload = {
      first_name: sanitizeInput(trimmedFirstName, 80),
      last_name: sanitizeInput(trimmedLastName, 80),
      phone: sanitizeInput(trimmedPhone, 40),
      email: sanitizeInput(trimmedEmail, 140),
      message: sanitizeInput(trimmedMessage, 2000)
    };

    try {
      const res = await fetch(buildApiUrl('/enquiry'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setStatusType(res.ok ? 'success' : 'error');
      setStatus(data.message || contact.form.messages.requestFailed);

      if (res.ok) {
        setFirstName('');
        setLastName('');
        setPhone('');
        setCountryCode('US');
        setEmail('');
        setMessage('');
      }
    } catch {
      setStatusType('error');
      setStatus(contact.form.messages.network);
    }
  };

  return (
    <motion.form onSubmit={handleSubmit} className="row g-3 contact-form" {...fadeUpProps}>
      {status && (
        <div className={`form-toast form-toast-${statusType === 'error' ? 'error' : 'success'}`} role="status" aria-live="polite">
          {status}
        </div>
      )}
      <div className="col-md-6">
        <label className="form-label">{contact.form.firstNameLabel} <span className="text-danger">*</span></label>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control application-form-control contact-form-control" placeholder={contact.form.firstNamePlaceholder} required />
      </div>
      <div className="col-md-6">
        <label className="form-label">{contact.form.lastNameLabel} <span className="text-danger">*</span></label>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control application-form-control contact-form-control" placeholder={contact.form.lastNamePlaceholder} required />
      </div>
      <div className="col-md-6">
        <label className="form-label">{contact.form.phoneLabel} <span className="text-danger">*</span></label>
        <div className="d-flex gap-2">
          <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} className="form-control application-form-control contact-form-control" placeholder={contact.form.phonePlaceholder} required />
        </div>
      </div>
      <div className="col-md-6">
        <label className="form-label">{contact.form.emailLabel} <span className="text-danger">*</span></label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control application-form-control contact-form-control" placeholder={contact.form.emailPlaceholder} required />
      </div>
      <div className="col-12">
        <label className="form-label">{contact.form.messageLabel} <span className="text-danger">*</span></label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="form-control application-form-control contact-form-control" placeholder={contact.form.messagePlaceholder} rows={5} required />
      </div>
      <div className="col-12">
        <motion.button type="submit" className="btn btn-success btn-lg contact-submit-btn" whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          {contact.form.submitButton}
        </motion.button>
      </div>
    </motion.form>
  );
}
