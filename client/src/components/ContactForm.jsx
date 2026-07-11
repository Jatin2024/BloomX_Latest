import { motion } from 'framer-motion';
import { useState } from 'react';
import { fadeUpProps } from '../utils/motion';

export default function ContactForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      message
    };

    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    setStatus(data.message);
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <motion.form onSubmit={handleSubmit} className="row g-3 contact-form" {...fadeUpProps}>
      <div className="col-md-6">
        <label className="form-label">First Name</label>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control application-form-control contact-form-control" placeholder="First name" required />
      </div>
      <div className="col-md-6">
        <label className="form-label">Last Name</label>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control application-form-control contact-form-control" placeholder="Last name" required />
      </div>
      <div className="col-md-6">
        <label className="form-label">Phone Number</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control application-form-control contact-form-control" placeholder="Phone number" required />
      </div>
      <div className="col-md-6">
        <label className="form-label">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control application-form-control contact-form-control" placeholder="you@example.com" required />
      </div>
      <div className="col-12">
        <label className="form-label">Message</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="form-control application-form-control contact-form-control" placeholder="Tell us about your project" rows={5} required />
      </div>
      <div className="col-12">
        <motion.button type="submit" className="btn btn-success btn-lg contact-submit-btn" whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          Send enquiry
        </motion.button>
        {status && <p className="text-success mt-3">{status}</p>}
      </div>
    </motion.form>
  );
}
