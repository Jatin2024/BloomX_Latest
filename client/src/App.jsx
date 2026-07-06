import { useEffect, useState } from 'react';

const services = [
  'Custom website development',
  'React and Angular web apps',
  'Node.js and .NET APIs',
  'Cloud deployment on AWS, Azure, and GCP'
];

const technologies = [
  'React.js',
  'Angular',
  'Node.js',
  'Express.js',
  'HTML',
  'CSS',
  'JavaScript',
  '.NET',
  'MongoDB',
  'AWS',
  'Azure',
  'GCP'
];

function App() {
  const [message, setMessage] = useState('Checking backend connectivity...');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Backend not reachable'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    const data = await res.json();
    setStatus(data.message);
    setName('');
  };

  return (
    <div className="page">
      <nav className="navbar">
        <div className="brand">BloomX</div>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">BloomX Studio</p>
          <h1>We build modern websites and digital experiences that grow your business.</h1>
          <p>
            From polished marketing sites to full-stack web applications, our team combines React,
            Angular, Node.js, .NET, Express.js, MongoDB, and cloud platforms to deliver reliable solutions.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">Book a project call</a>
            <a className="btn btn-secondary" href="#services">Explore services</a>
          </div>
          <p className="status">Backend status: {message}</p>
        </div>

        <div className="hero-card">
          <h2>Our focus</h2>
          <ul>
            <li>Fast, responsive websites</li>
            <li>Scalable web applications</li>
            <li>Secure APIs and databases</li>
            <li>Cloud-ready deployment</li>
          </ul>
        </div>
      </header>

      <section id="about" className="section intro-strip">
        <div>
          <h2>Why companies choose BloomX</h2>
          <p>We blend strategy, design, development, and cloud deployment into one dependable partnership.</p>
        </div>
        <div className="quote-box">
          <strong>Reliable delivery</strong>
          <p>From landing pages to scalable platforms, we build with performance and growth in mind.</p>
        </div>
      </section>

      <section id="services" className="section">
        <h2>What we deliver</h2>
        <div className="card-grid">
          {services.map((service) => (
            <div className="card" key={service}>
              <h3>{service}</h3>
              <p>Tailored solutions for startups, growing companies, and enterprise teams.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Technologies we use</h2>
        <div className="chip-list">
          {technologies.map((tech) => (
            <span className="chip" key={tech}>{tech}</span>
          ))}
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div>
          <h2>Let’s build something impactful</h2>
          <p>Share a few details and we’ll help shape your next web project.</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <button type="submit">Start conversation</button>
        </form>

        {status && <p className="form-status">{status}</p>}
      </section>

      <footer className="footer">
        <p>© 2026 BloomX. Website development solutions for modern businesses.</p>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
