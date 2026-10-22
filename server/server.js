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
const CORS_ALLOWED_ORIGINS = String(process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const DOWNLOAD_LINK_TTL_MS = 15 * 60 * 1000;
const ALLOWED_RESUME_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

/**
 * Leading bytes each accepted resume type must actually start with.
 *
 * The multipart Content-Type is supplied by the client and can claim
 * anything, so the declared MIME is checked against the real file signature
 * before the bytes are stored or ever served back.
 */
const RESUME_SIGNATURES = {
  'application/pdf': [[0x25, 0x50, 0x44, 0x46, 0x2d]], // %PDF-
  'application/msword': [[0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]], // OLE2 compound file
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    [0x50, 0x4b, 0x03, 0x04], // PK.. — docx is a zip container
    [0x50, 0x4b, 0x05, 0x06],
    [0x50, 0x4b, 0x07, 0x08]
  ]
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Rejects a value that is not a plain string — blocks object/array payloads
 *  such as `{"$ne": null}` reaching query or document construction. */
function isPlainString(value) {
  return typeof value === 'string';
}

function matchesSignature(buffer, mimetype) {
  const signatures = RESUME_SIGNATURES[mimetype];
  if (!signatures || !Buffer.isBuffer(buffer)) {
    return false;
  }

  return signatures.some(
    (sig) => buffer.length >= sig.length && sig.every((byte, index) => buffer[index] === byte)
  );
}

/** Timing-safe string comparison — a plain `!==` leaks length and position
 *  information through response timing when comparing secrets. */
function safeEqual(a, b) {
  const left = Buffer.from(String(a ?? ''), 'utf8');
  const right = Buffer.from(String(b ?? ''), 'utf8');

  if (left.length !== right.length) {
    // Still compare, so the failure cost does not depend on length.
    crypto.timingSafeEqual(left, left);
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

/** Strips anything that could break out of a quoted Content-Disposition
 *  filename, and supplies an RFC 5987 form for non-ASCII names. */
function contentDispositionFilename(name) {
  const fallback = String(name || 'resume')
    .replace(/[\r\n"\\]/g, '')
    .replace(/[^\x20-\x7e]/g, '_')
    .slice(0, 180)
    .trim() || 'resume';

  const encoded = encodeURIComponent(String(name || 'resume').slice(0, 180));
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

let mongoStatus = MONGO_URI ? 'disconnected' : 'disabled';

if (RAW_MONGO_URI && !MONGO_URI) {
  console.warn('MONGO_URI includes placeholder values. Replace them with real credentials.');
}

const corsOptions = CORS_ALLOWED_ORIGINS.length
  ? {
      origin: (origin, callback) => {
        // Allow non-browser clients and same-origin server-side requests.
        if (!origin) {
          return callback(null, true);
        }

        if (CORS_ALLOWED_ORIGINS.includes(origin)) {
          return callback(null, true);
        }

        console.warn(`Blocked CORS origin: ${origin}`);
        return callback(null, false);
      }
    }
  : { origin: true };

if (CORS_ALLOWED_ORIGINS.length) {
  console.log(`CORS allowlist enabled for origins: ${CORS_ALLOWED_ORIGINS.join(', ')}`);
} else {
  console.warn(
    'WARNING: CORS_ALLOWED_ORIGINS is not set — every origin is reflected. ' +
      'Set it to the deployed site origin before going to production.'
  );
}

if (!ADMIN_API_KEY) {
  console.warn(
    'WARNING: ADMIN_API_KEY is not set — the admin endpoints and signed resume ' +
      'downloads are disabled until it is configured.'
  );
}

// Do not advertise the framework and version to scanners.
app.disable('x-powered-by');

/*
 * Rate limiting keys on req.ip. Behind a proxy (Vercel, nginx, a load
 * balancer) every request arrives from the proxy address, so without this
 * the whole internet shares one bucket. Enabling it makes Express trust
 * X-Forwarded-For, which a direct client can forge — so it stays opt-in and
 * should name the hop count or the proxy's address, never a blanket `true`
 * on a publicly reachable server.
 *   TRUST_PROXY=1            trust one proxy hop
 *   TRUST_PROXY=10.0.0.0/8   trust a known proxy subnet
 */
const TRUST_PROXY = (process.env.TRUST_PROXY || '').trim();
if (TRUST_PROXY) {
  const numeric = Number(TRUST_PROXY);
  app.set('trust proxy', Number.isFinite(numeric) ? numeric : TRUST_PROXY);
  console.log(`trust proxy enabled: ${TRUST_PROXY}`);
}

/*
 * Baseline response headers. This process only ever returns JSON and file
 * downloads, so the set is deliberately small — no CSP here, since the
 * browsing context is the separately hosted front end.
 */
app.use((req, res, next) => {
  // Stop browsers second-guessing the declared Content-Type, which is what
  // turns an "image" upload into executable script.
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // An API has no reason to be framed.
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  // Keep URLs out of Referer when leaving to another origin.
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), interest-cohort=()');
  // Only meaningful once served over TLS; harmless otherwise.
  if (req.secure || req.get('x-forwarded-proto') === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

app.use(cors(corsOptions));
// The largest legitimate enquiry is a little over 2KB; the default 100KB is
// far more room than any caller needs.
app.use(express.json({ limit: '32kb' }));

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

  if (!suppliedKey || !safeEqual(suppliedKey, ADMIN_API_KEY)) {
    return res.status(401).json({ message: 'Unauthorized admin access.' });
  }

  return next();
}

/*
 * Resume download tokens are signed with ADMIN_API_KEY.
 *
 * There is deliberately no fallback secret. A hard-coded default would be
 * readable by anyone with the source, letting them mint a valid token for
 * any submission id and pull applicants' CVs straight out of the database —
 * ObjectIds embed a timestamp and are far from unguessable. With no key
 * configured, token issuing and verification are simply unavailable.
 */
function signingKey() {
  return ADMIN_API_KEY || null;
}

function createSignedDownloadToken(submissionId) {
  const key = signingKey();
  if (!key) {
    return null;
  }

  const expiresAt = Date.now() + DOWNLOAD_LINK_TTL_MS;
  const payload = { submissionId: String(submissionId), expiresAt };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', key).update(encodedPayload).digest('hex');
  return `${encodedPayload}.${signature}`;
}

function verifySignedDownloadToken(token) {
  const key = signingKey();
  if (!key || !token) {
    return null;
  }

  const [encodedPayload, signature] = String(token).split('.');
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = crypto.createHmac('sha256', key).update(encodedPayload).digest('hex');
  if (!safeEqual(expectedSignature, signature)) {
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

  // Every field must be a string. Multipart bodies can carry repeated keys,
  // which Express surfaces as arrays — rejecting non-strings keeps arrays and
  // objects out of document construction entirely.
  if (![first_name, last_name, email, phone, why_hire].every(isPlainString)) {
    return res.status(400).json({ message: 'Invalid field format.' });
  }

  if (position !== undefined && !isPlainString(position)) {
    return res.status(400).json({ message: 'Invalid field format.' });
  }

  if (!first_name || !last_name || !email || !phone || !why_hire || !resume) {
    return res.status(400).json({ message: 'Please provide all required fields and attach your resume.' });
  }

  if (!EMAIL_PATTERN.test(email.trim()) || email.length > 140) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  if (!/^[\d\s+()-]{6,40}$/.test(phone.trim())) {
    return res.status(400).json({ message: 'Please provide a valid phone number.' });
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

  // The declared type is attacker-controlled; the bytes are not.
  if (!matchesSignature(resume.buffer, resume.mimetype)) {
    return res.status(400).json({
      message: 'Resume contents do not match the file type. Upload a real PDF or Word document.'
    });
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

  // Reject non-strings before anything touches the database — this is what
  // stops a payload like {"first_name": {"$ne": null}} getting any further.
  if (![first_name, last_name, email, phone, message].every(isPlainString)) {
    return res.status(400).json({ message: 'Invalid field format.' });
  }

  if (!first_name || !last_name || !email || !phone || !message) {
    return res.status(400).json({ message: 'Please provide all required enquiry fields.' });
  }

  if (!EMAIL_PATTERN.test(email.trim()) || email.length > 140) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  if (!/^[\d\s+()-]{6,40}$/.test(phone.trim())) {
    return res.status(400).json({ message: 'Please provide a valid phone number.' });
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
            downloadUrl: (() => {
              const token = createSignedDownloadToken(item._id);
              return token
                ? `/api/admin/submissions/${item._id}/resume?token=${encodeURIComponent(token)}`
                : null;
            })()
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
    // Only ever hand back a type from the allowlist; never echo a stored
    // value that could coax the browser into rendering the file inline.
    const safeType = ALLOWED_RESUME_MIME.has(submission.resume.mimeType)
      ? submission.resume.mimeType
      : 'application/octet-stream';

    res.setHeader('Content-Type', safeType);
    res.setHeader('Content-Disposition', contentDispositionFilename(downloadName));
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.send(resumeBinary);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch resume file.' });
  }
});

function startServer(port) {
  // Bind on all interfaces: container platforms (Render, Fly, Docker) route
  // to the container IP, so listening only on localhost is unreachable.
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code !== 'EADDRINUSE') {
      console.error(err);
      process.exit(1);
    }

    /*
     * Walking to the next free port is a convenience for local development
     * only. A hosting platform assigns the port through $PORT and health
     * checks that exact port — drifting to another one leaves the service
     * permanently unhealthy with no obvious cause. Fail loudly instead.
     */
    if (process.env.PORT) {
      console.error(
        `Port ${port} (from $PORT) is already in use. Refusing to bind elsewhere, ` +
          'because the platform only routes traffic to the assigned port.'
      );
      process.exit(1);
    }

    console.warn(`Port ${port} is busy. Trying ${port + 1}...`);
    server.close(() => startServer(port + 1));
  });
}

initMongoConnection().finally(() => startServer(DEFAULT_PORT));

app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Resume file is too large. Max size is 5MB.' });
    }
    return res.status(400).json({ message: 'Invalid file upload.' });
  }

  // body-parser raises 413 for oversized payloads and 400 for malformed JSON.
  // Surfacing the real status keeps those out of the 500 bucket, so genuine
  // faults stay visible in the logs instead of being drowned by junk traffic.
  const status = Number(err.status || err.statusCode);

  if (Number.isFinite(status) && status >= 400 && status < 500) {
    if (status === 413) {
      return res.status(413).json({ message: 'Request body is too large.' });
    }
    return res.status(status).json({ message: 'Malformed request.' });
  }

  // Unexpected: log in full, but never return internals to the caller.
  console.error(err);
  return res.status(500).json({ message: 'Unexpected server error.' });
});
