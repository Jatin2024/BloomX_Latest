import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 5001;
const MONGO_URI = process.env.MONGO_URI || '';

app.use(cors());
app.use(express.json());

const messageSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running' });
});

app.post('/api/messages', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      const message = await Message.create({ name });
      return res.json({ message: `Saved to MongoDB: ${message.name}` });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to save to MongoDB' });
    }
  }

  return res.json({ message: `Received from frontend: ${name}` });
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is busy. Trying ${port + 1}...`);
      server.close(() => startServer(port + 1));
    } else {
      console.error(err);
      process.exit(1);
    }
  });
}

startServer(DEFAULT_PORT);
