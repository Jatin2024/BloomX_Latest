import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 5001;
const MONGO_URI = process.env.MONGO_URI || '';

app.use(cors());
app.use(express.json());

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  whyHire: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

app.get('/api/health', (req, res) => {
  res.json({ message: 'BloomX API is ready for website development solutions.' });
});

app.post('/api/apply', upload.single('resume'), async (req, res) => {
  const { first_name, last_name, email, phone, why_hire } = req.body;
  const resume = req.file;

  if (!first_name || !last_name || !email || !phone || !why_hire || !resume) {
    return res.status(400).json({ message: 'Please provide all required fields and attach your resume.' });
  }

  const fullName = `${first_name} ${last_name}`.trim();
  console.log(`Received application from ${fullName}`, {
    email,
    phone,
    resumeName: resume.originalname,
    resumeType: resume.mimetype
  });

  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      const message = await Message.create({
        name: fullName,
        email,
        phone,
        whyHire: why_hire
      });
      return res.json({ message: `Application received: ${message.name}` });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to save application to MongoDB' });
    }
  }

  return res.json({ message: `Thanks ${fullName}! Your application is received and will be reviewed soon.` });
});

app.post('/api/enquiry', async (req, res) => {
  const { first_name, last_name, email, phone, message } = req.body;

  if (!first_name || !last_name || !email || !phone || !message) {
    return res.status(400).json({ message: 'Please provide all required enquiry fields.' });
  }

  const fullName = `${first_name} ${last_name}`.trim();

  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      const enquiry = await Message.create({
        name: fullName,
        email,
        phone,
        message
      });
      return res.json({ message: `Enquiry received: ${enquiry.name}` });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to save enquiry to MongoDB' });
    }
  }

  return res.json({ message: `Thanks ${fullName}! Your enquiry is received and we will get back to you soon.` });
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
