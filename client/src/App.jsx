import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');
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
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: '40px auto' }}>
      <h1>BloomX Integration Test</h1>
      <p>Backend status: {message}</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit">Send</button>
      </form>

      {status && <p style={{ marginTop: '12px' }}>{status}</p>}
    </div>
  );
}

export default App;
