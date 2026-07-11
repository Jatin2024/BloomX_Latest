import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUpProps } from '../utils/motion';

export default function JobApplicationForm({ positions = [], selectedPosition = '', onPositionChange }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState(selectedPosition || positions[0] || '');
  const [resumeFile, setResumeFile] = useState(null);
  const [whyHire, setWhyHire] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (selectedPosition) {
      setPosition(selectedPosition);
    }
  }, [selectedPosition]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('position', position);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('why_hire', whyHire);
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    const res = await fetch('/api/apply', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    setStatus(data.message);
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setPosition(selectedPosition || positions[0] || '');
    setResumeFile(null);
    setWhyHire('');
    e.target.reset();
  };

  const handlePositionChange = (value) => {
    setPosition(value);
    if (onPositionChange) {
      onPositionChange(value);
    }
  };

  return (
    <motion.form onSubmit={handleSubmit} className="row g-3 application-form" {...fadeUpProps}>
      <div className="col-12">
        <label className="form-label">Position you are applying for</label>
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
        <label className="form-label">First Name</label>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control application-form-control" placeholder="First name" required />
      </div>
      <div className="col-md-6">
        <label className="form-label">Last Name</label>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control application-form-control" placeholder="Last name" required />
      </div>
      <div className="col-md-6">
        <label className="form-label">Phone Number</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control application-form-control" placeholder="Phone number" required />
      </div>
      <div className="col-md-6">
        <label className="form-label">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control application-form-control" placeholder="you@example.com" required />
      </div>
      <div className="col-12">
        <label className="form-label">Resume</label>
        <input type="file" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} className="form-control application-form-control" required />
      </div>
      <div className="col-12">
        <label className="form-label">Why should we hire you?</label>
        <textarea value={whyHire} onChange={(e) => setWhyHire(e.target.value)} className="form-control application-form-control" placeholder="Tell us what makes you a great fit" rows={5} required />
      </div>
      <div className="col-12">
        <motion.button type="submit" className="btn btn-success btn-lg job-submit-btn" whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          Submit application
        </motion.button>
        {status && <p className="text-success mt-3">{status}</p>}
      </div>
    </motion.form>
  );
}
