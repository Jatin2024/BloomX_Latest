import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { ApplicationSubmission, Enquiry } from './models/forms.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });
dotenv.config({ path: path.resolve(__dirname, '../.env'), quiet: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});
const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 5001;
const RAW_MONGO_URI = process.env.MONGO_URI || '';
const MONGO_URI = RAW_MONGO_URI.includes('<db_username>') ? '' : RAW_MONGO_URI;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';
const DOWNLOAD_LINK_TTL_MS = 15 * 60 * 1000;
const ALLOWED_RESUME_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

let mongoStatus = MONGO_URI ? 'disconnected' : 'disabled';

if (RAW_MONGO_URI && !MONGO_URI) {
  console.warn('MONGO_URI includes placeholder values. Replace them with real credentials.');
}

app.use(cors());
app.use(express.json());

app.use('/api', (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms ip=${ip}`);
  });
  next();
});

function createRateLimitHandler(defaultMessage) {
  return (req, res, _next, options) => {
    const resetTime = req.rateLimit?.resetTime ? new Date(req.rateLimit.resetTime).getTime() : Date.now() + options.windowMs;
    const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - Date.now()) / 1000));

    res.set('Retry-After', String(retryAfterSeconds));
    return res.status(429).json({
      message: defaultMessage,
      retryAfterSeconds
    });
  };
}

const healthLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler('Too many health checks. Please retry shortly.')
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
  handler: createRateLimitHandler('Too many requests. Please try again shortly.')
});

const formSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler('Too many form submissions. Please wait and try again.')
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler('Too many admin requests. Please retry later.')
});

app.use('/api/health', healthLimiter);
app.use('/api/admin', adminLimiter);
app.use('/api', apiLimiter);

function hasSuspiciousInput(value) {
  const text = String(value || '');
  return /<\s*script|javascript:|on\w+\s*=|<\s*iframe|<\s*object|<\s*embed|data:text\/html|vbscript:/i.test(text);
}

function sanitizeText(value, maxLength = 2000) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function validateAdminApiKey(req, res, next) {
  if (!ADMIN_API_KEY) {
    return res.status(503).json({ message: 'Admin API is not configured.' });
  }

  const headerKey = req.get('x-admin-key') || '';
  const authHeader = req.get('authorization') || '';
  const bearerKey = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const suppliedKey = headerKey || bearerKey;

  if (!suppliedKey || suppliedKey !== ADMIN_API_KEY) {
    return res.status(401).json({ message: 'Unauthorized admin access.' });
  }

  return next();
}

function createSignedDownloadToken(submissionId) {
  const expiresAt = Date.now() + DOWNLOAD_LINK_TTL_MS;
  const payload = { submissionId: String(submissionId), expiresAt };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', ADMIN_API_KEY || 'bloomx-download-secret').update(encodedPayload).digest('hex');
  return `${encodedPayload}.${signature}`;
}

function verifySignedDownloadToken(token) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = String(token).split('.');
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = crypto.createHmac('sha256', ADMIN_API_KEY || 'bloomx-download-secret').update(encodedPayload).digest('hex');
  if (expectedSignature !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (!payload?.submissionId || !payload?.expiresAt || payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function validateAdminOrSignedDownload(req, res, next) {
  const tokenPayload = verifySignedDownloadToken(req.query.token || '');
  if (tokenPayload && String(tokenPayload.submissionId) === String(req.params.id || '')) {
    return next();
  }

  return validateAdminApiKey(req, res, next);
}

function normalizeResumeBinary(data) {
  if (!data) {
    return null;
  }

  if (Buffer.isBuffer(data)) {
    return data;
  }

  if (data?.type === 'Buffer' && Array.isArray(data.data)) {
    return Buffer.from(data.data);
  }

  if (data?.buffer && Buffer.isBuffer(data.buffer)) {
    return data.buffer;
  }

  if (Array.isArray(data)) {
    return Buffer.from(data);
  }

  if (typeof data === 'string') {
    const trimmed = data.trim();
    const unquoted = trimmed.startsWith('"') && trimmed.endsWith('"')
      ? trimmed.slice(1, -1)
      : trimmed;
    return Buffer.from(unquoted, 'base64');
  }

  return null;
}

async function initMongoConnection() {
  if (!MONGO_URI) {
    return;
  }

  try {
    mongoStatus = 'connecting';
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    mongoStatus = 'connected';
    console.log('MongoDB connected');
  } catch (err) {
    mongoStatus = 'error';
    console.error('MongoDB connection failed:', err.message);
  }
}

mongoose.connection.on('disconnected', () => {
  if (MONGO_URI) {
    mongoStatus = 'disconnected';
  }
});

mongoose.connection.on('error', () => {
  if (MONGO_URI) {
    mongoStatus = 'error';
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    message: 'BloomX API is ready for website development solutions.',
    mongodb: {
      enabled: Boolean(MONGO_URI),
      status: mongoStatus
    }
  });
});

app.post('/api/apply', formSubmitLimiter, upload.single('resume'), async (req, res) => {
  const { first_name, last_name, email, phone, why_hire, position } = req.body;
  const resume = req.file;

  if (!first_name || !last_name || !email || !phone || !why_hire || !resume) {
    return res.status(400).json({ message: 'Please provide all required fields and attach your resume.' });
  }

  if (
    hasSuspiciousInput(first_name) ||
    hasSuspiciousInput(last_name) ||
    hasSuspiciousInput(email) ||
    hasSuspiciousInput(phone) ||
    hasSuspiciousInput(why_hire)
  ) {
    return res.status(400).json({ message: 'Invalid input detected. Please remove scripts or unsafe markup.' });
  }

  if (!ALLOWED_RESUME_MIME.has(resume.mimetype)) {
    return res.status(400).json({ message: 'Unsupported resume file type.' });
  }

  const safeFirstName = sanitizeText(first_name, 80);
  const safeLastName = sanitizeText(last_name, 80);
  const safeEmail = sanitizeText(email, 140);
  const safePhone = sanitizeText(phone, 40);
  const safePosition = sanitizeText(position || 'Unspecified', 120);
  const safeWhyHire = sanitizeText(why_hire, 2000);

  const fullName = `${safeFirstName} ${safeLastName}`.trim();
  console.log(`Received application from ${fullName}`, {
    email: safeEmail,
    phone: safePhone,
    resumeName: resume.originalname,
    resumeType: resume.mimetype
  });

  if (mongoStatus === 'connected') {
    try {
      const message = await ApplicationSubmission.create({
        type: 'application',
        name: fullName,
        email: safeEmail,
        phone: safePhone,
        position: safePosition,
        whyHire: safeWhyHire,
        resume: {
          fileName: sanitizeText(resume.originalname || 'resume', 180),
          mimeType: resume.mimetype,
          size: resume.size,
          data: resume.buffer
        }
      });
      return res.json({ message: `Application received: ${message.name}` });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to save application to MongoDB' });
    }
  }

  return res.json({ message: `Thanks ${fullName}! Your application is received and will be reviewed soon.` });
});

app.post('/api/enquiry', formSubmitLimiter, async (req, res) => {
  const { first_name, last_name, email, phone, message } = req.body;

  if (!first_name || !last_name || !email || !phone || !message) {
    return res.status(400).json({ message: 'Please provide all required enquiry fields.' });
  }

  if (
    hasSuspiciousInput(first_name) ||
    hasSuspiciousInput(last_name) ||
    hasSuspiciousInput(email) ||
    hasSuspiciousInput(phone) ||
    hasSuspiciousInput(message)
  ) {
    return res.status(400).json({ message: 'Invalid input detected. Please remove scripts or unsafe markup.' });
  }

  const safeFirstName = sanitizeText(first_name, 80);
  const safeLastName = sanitizeText(last_name, 80);
  const safeEmail = sanitizeText(email, 140);
  const safePhone = sanitizeText(phone, 40);
  const safeMessage = sanitizeText(message, 2000);

  const fullName = `${safeFirstName} ${safeLastName}`.trim();

  if (mongoStatus === 'connected') {
    try {
      const enquiry = await Enquiry.create({
        type: 'enquiry',
        name: fullName,
        email: safeEmail,
        phone: safePhone,
        message: safeMessage
      });
      return res.json({ message: `Enquiry received: ${enquiry.name}` });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to save enquiry to MongoDB' });
    }
  }

  return res.json({ message: `Thanks ${fullName}! Your enquiry is received and we will get back to you soon.` });
});

app.get('/api/admin/submissions', validateAdminApiKey, async (req, res) => {
  if (mongoStatus !== 'connected') {
    return res.status(503).json({ message: 'MongoDB is not connected.' });
  }

  const requestedType = String(req.query.type || '').trim();
  const page = Math.max(1, Number.parseInt(String(req.query.page || '1'), 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit || '20'), 10) || 20));

  if (requestedType && !['application', 'enquiry'].includes(requestedType)) {
    return res.status(400).json({ message: 'Invalid type filter. Use application or enquiry.' });
  }

  const model = requestedType === 'enquiry' ? Enquiry : ApplicationSubmission;
  const filter = requestedType ? { type: requestedType } : {};

  try {
    const total = await model.countDocuments(filter);
    const submissions = await model.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v')
      .lean();

    const sanitizedSubmissions = submissions.map((item) => ({
      ...item,
      resume: item.resume
        ? {
            fileName: item.resume.fileName,
            mimeType: item.resume.mimeType,
            size: item.resume.size,
            hasFile: true,
            downloadUrl: `/api/admin/submissions/${item._id}/resume?token=${encodeURIComponent(createSignedDownloadToken(item._id))}`
          }
        : null
    }));

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      submissions: sanitizedSubmissions
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch submissions.' });
  }
});

app.get('/api/admin/submissions/:id/resume', validateAdminOrSignedDownload, async (req, res) => {
  if (mongoStatus !== 'connected') {
    return res.status(503).json({ message: 'MongoDB is not connected.' });
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid submission id.' });
  }

  try {
    const submission = await ApplicationSubmission.findById(id)
      .select('resume name createdAt')
      .lean();

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    if (!submission.resume?.data) {
      return res.status(404).json({ message: 'No resume file stored for this submission.' });
    }

    const resumeBinary = normalizeResumeBinary(submission.resume.data);
    if (!resumeBinary || !resumeBinary.length) {
      return res.status(500).json({ message: 'Stored resume format is invalid.' });
    }

    const downloadName = submission.resume.fileName || `resume-${id}`;
    res.setHeader('Content-Type', submission.resume.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    return res.send(resumeBinary);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch resume file.' });
  }
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

initMongoConnection().finally(() => startServer(DEFAULT_PORT));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Resume file is too large. Max size is 5MB.' });
  }

  if (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unexpected server error.' });
  }

  return next();
});
