require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PassThrough } = require('stream');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const archiverModule = require('archiver');
const XLSX = require('xlsx');
const nodemailer = require('nodemailer');

const createArchiver = typeof archiverModule === 'function' ? archiverModule : (archiverModule.default || archiverModule.create);
function getZipArchive() {
  if (typeof createArchiver === 'function') {
    return createArchiver('zip', { zlib: { level: 9 } });
  }
  return new archiverModule.ZipArchive({ zlib: { level: 9 } });
}

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '';

// Supports multiple equal-access admin accounts: ADMIN_USERS=user1:pass1,user2:pass2
// Falls back to the single ADMIN_PANEL_USER/ADMIN_PANEL_PASS pair for backward compatibility.
const ADMIN_CREDENTIALS = new Map();
(process.env.ADMIN_USERS || '')
  .split(',')
  .map(pair => pair.trim())
  .filter(Boolean)
  .forEach(pair => {
    const idx = pair.indexOf(':');
    if (idx > 0) ADMIN_CREDENTIALS.set(pair.slice(0, idx), pair.slice(idx + 1));
  });
if (process.env.ADMIN_PANEL_USER && process.env.ADMIN_PANEL_PASS) {
  ADMIN_CREDENTIALS.set(process.env.ADMIN_PANEL_USER, process.env.ADMIN_PANEL_PASS);
}

app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: false // frontend is a pre-built SPA; avoid breaking inline scripts it may rely on
}));
app.use(cors(ALLOWED_ORIGIN ? { origin: ALLOWED_ORIGIN } : {}));
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', apiLimiter);

const exportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});

// Tighter limit than the general API limiter — these endpoints exist purely
// to check whitelist membership, so they're the most enumeration-attractive.
const validateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false
});

// Admin routes require HTTP Basic Auth (same credentials enforced at nginx layer too)
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const sep = decoded.indexOf(':');
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (ADMIN_CREDENTIALS.has(user) && ADMIN_CREDENTIALS.get(user) === pass) {
      req.adminUser = user;
      return next();
    }
    // A credential was actually submitted and rejected — log it (skip bare/no-auth probes to avoid noise)
    recordAuditLog(req, `Failed admin login attempt (username: "${user}")`, user || 'Unknown').catch(() => {});
  }
  res.setHeader('WWW-Authenticate', 'Basic realm="Kando Admin"');
  return res.status(401).json({ error: 'Unauthorized' });
}

// Serve static frontend build from /dist
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Uploads directory setup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Serve uploads as downloads only — prevents any uploaded HTML/SVG from executing in-browser (stored XSS)
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res) => {
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { Upload } = require('@aws-sdk/lib-storage');

// Cloudflare R2 Configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || 'b272577e002d6d57aafa1d19eac41046';
const R2_BUCKET = process.env.R2_BUCKET || 'kandosfromhome';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}`;

let r2Client = null;
if (R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY) {
  r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY
    }
  });
  console.log('Cloudflare R2 Storage initialized for bucket:', R2_BUCKET);
}

// SMTP (Gmail) — used only to email a download link for the CSV+ZIP export,
// never the file itself (large exports can be GBs, way past attachment limits).
function maskEmail(user) {
  const [name, domain] = user.split('@');
  return `${name.slice(0, 2)}***@${domain || ''}`;
}
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
let mailTransporter = null;
if (SMTP_USER && SMTP_PASS) {
  mailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  console.log('SMTP mail transporter initialized for', maskEmail(SMTP_USER));
}

// Multer writes to local disk first; once the file is safely in R2 the local
// copy serves no purpose and must go, or disk fills up long before R2 does.
function cleanupLocalFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') console.error('Local file cleanup error:', err);
  });
}

async function uploadFileToR2(filePath, fileName, mimeType, userFolder) {
  if (!r2Client) return null;
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const folder = userFolder ? `uploads/${userFolder}` : 'uploads';
    // fileName is the final human-readable object name (e.g. RD1234_M_photo1.jpg) —
    // one submission per employee is enforced, so no collision risk without a timestamp.
    const key = `${folder}/${fileName}`;
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType
    });
    await r2Client.send(command);
    return `${R2_PUBLIC_URL}/${key}`;
  } catch (err) {
    console.error('Cloudflare R2 Upload Error:', err);
    return null;
  }
}

// Generate user-specific R2 folder name
// Format: empId_INITIALS (e.g. YMI-101_RS) or last4phone_INITIALS (e.g. 7896_RS)
function getUserFolder(empId, empName, phone) {
  const initials = (empName || 'U')
    .trim()
    .split(/\s+/)
    .filter(function(w) { return w.length > 0; })
    .map(function(w) { return w[0].toUpperCase(); })
    .join('');
  if (empId && empId.trim()) {
    return empId.trim() + '_' + initials;
  }
  const digits = (phone || '').replace(/\D/g, '');
  const last4 = digits.slice(-4) || '0000';
  return last4 + '_' + initials;
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif',
  'video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska',
  'application/pdf'
]);

const upload = multer({
  storage,
  limits: { fileSize: 55 * 1024 * 1024 }, // 55MB max buffer
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error('Unsupported file type. Only images, videos and PDFs are allowed.'));
  }
});

// Whitelist CSV/Excel uploads are parsed in memory and discarded — nothing to
// persist to disk or R2, only the parsed rows matter.
const whitelistUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Reads the first column of every row after the header row.
function parseWhitelistFile(buffer) {
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const values = rows.slice(1)
    .map(row => row[0])
    .filter(cell => cell !== undefined && cell !== null && String(cell).trim() !== '')
    .map(cell => String(cell).trim());
  return [...new Set(values)];
}

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kando_db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected to', MONGO_URI))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Schemas
// empId is optional now — the ~50 employees with no ID identify by phone
// instead, so both are sparse-unique (only indexed when actually present).
const UserSchema = new mongoose.Schema({
  empId: { type: String, unique: true, sparse: true },
  empName: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, unique: true, sparse: true },
  city: { type: String },
  familyMembers: { type: Number, default: 1 },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Form1Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  empId: { type: String },
  phone: { type: String },
  companyName: { type: String, default: '' },
  department: { type: String, default: '' },
  photo1Url: { type: String, required: true },
  photo2Url: { type: String },
  videoUrl: { type: String },
  ceoReflection: { type: String },
  language: { type: String, default: 'en' },
  submittedAt: { type: Date, default: Date.now },
  ip: { type: String }
});

const Form2Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  empId: { type: String },
  phone: { type: String },
  companyName: { type: String, default: '' },
  department: { type: String, default: '' },
  location: { type: String, default: '' },
  thoughts: { type: String, default: '' },
  optionalFileUrl: { type: String, default: '' },
  language: { type: String, default: 'en' },
  submittedAt: { type: Date, default: Date.now },
  ip: { type: String }
});

// Client-provided eligibility lists — the ~4950 employees with an Employee ID,
// and the ~50 without one who are identified by phone number instead.
const AllowedEmployeeSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true, trim: true }
});
const AllowedPhoneSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, trim: true }
});

const AuditLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: { type: String, default: '127.0.0.1' },
  detail: { type: String, required: true },
  username: { type: String, default: 'Admin' }
});

const SettingsSchema = new mongoose.Schema({
  captchaEnabled: { type: Boolean, default: false },
  googleAnalyticsId: { type: String, default: '' },
  customTags: { type: [String], default: ['Shortlisted', 'Featured', 'Flagged', 'Verified'] }
});

const User = mongoose.model('User', UserSchema);
const Form1 = mongoose.model('Form1', Form1Schema);
const Form2 = mongoose.model('Form2', Form2Schema);
const AllowedEmployee = mongoose.model('AllowedEmployee', AllowedEmployeeSchema);
const AllowedPhone = mongoose.model('AllowedPhone', AllowedPhoneSchema);
const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
const Settings = mongoose.model('Settings', SettingsSchema);

// Helper for adding audit log (append-only)
async function recordAuditLog(req, detail, username = 'SuperAdmin') {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  await AuditLog.create({
    timestamp: new Date(),
    ip,
    detail,
    username
  });
}

// ── API ROUTES ──

// Real-time eligibility checks against the client-provided whitelist, used by
// both forms as the admin types their Employee ID / Phone Number.
app.get('/api/validate-empid', validateLimiter, async (req, res) => {
  const empId = (req.query.id || '').toString().trim();
  if (!empId) return res.json({ valid: false });
  const found = await AllowedEmployee.findOne({ empId });
  res.json({ valid: !!found });
});

app.get('/api/validate-phone', validateLimiter, async (req, res) => {
  const phone = (req.query.phone || '').toString().trim();
  if (!phone) return res.json({ valid: false });
  const found = await AllowedPhone.findOne({ phone });
  res.json({ valid: !!found });
});

// Check if Employee ID already exists (Unique Employee ID API)
app.get('/api/check-empid', async (req, res) => {
  try {
    const { empId, email } = req.query;
    if (!empId) return res.json({ exists: false });

    const user = await User.findOne({ empId: empId.toString().trim() });
    if (!user) return res.json({ exists: false });

    const isSameUser = email && user.email.toLowerCase() === email.toString().trim().toLowerCase();
    res.json({
      exists: true,
      isSameUser,
      registeredName: user.empName,
      registeredEmail: user.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Check if user already submitted
app.get('/api/check-submission', async (req, res) => {
  try {
    const { empId, email, phone } = req.query;
    if (!empId && !email && !phone) return res.json({ submitted: false });

    // Only match on fields that were actually provided — email/phone are
    // optional, and matching a blank string would return an arbitrary other
    // blank-field user.
    const orClauses = [];
    if (empId) orClauses.push({ empId });
    if (email) orClauses.push({ email });
    if (phone) orClauses.push({ phone });
    const user = await User.findOne({ $or: orClauses });

    if (!user) return res.json({ submitted: false, hasForm1: false, hasForm2: false });

    const f1 = await Form1.findOne({ userId: user._id });
    const f2 = await Form2.findOne({ userId: user._id });

    return res.json({
      submitted: !!(f1 || f2),
      hasForm1: !!f1,
      hasForm2: !!f2,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Most employees identify by Employee ID; the ~50 with no ID identify by
// phone number instead — either way, they must appear in the client-supplied
// whitelist to submit.
async function resolveEligibleIdentity(rawEmpId, rawPhone) {
  const cleanEmpId = (rawEmpId || '').toString().trim();
  const cleanPhone = (rawPhone || '').toString().trim();
  if (!cleanEmpId && !cleanPhone) {
    return { ok: false, error: 'Employee ID is required. If you don\'t have one, enter your Phone Number instead.' };
  }
  if (cleanEmpId) {
    const allowed = await AllowedEmployee.findOne({ empId: cleanEmpId });
    if (!allowed) return { ok: false, error: 'This Employee ID was not found in company records. Please check and try again.' };
  } else {
    const allowed = await AllowedPhone.findOne({ phone: cleanPhone });
    if (!allowed) return { ok: false, error: 'This Phone Number was not found in company records. Please check and try again.' };
  }
  return { ok: true, cleanEmpId, cleanPhone };
}

// Form 1 Submission
const form1Upload = upload.fields([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

app.post('/api/submissions/form1', (req, res, next) => {
  form1Upload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'Only 2 photos (photo1, photo2) and 1 video are allowed per submission.' });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File exceeds the maximum allowed size.' });
      }
      return res.status(400).json({ error: err.message || 'File upload error.' });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { empId, phone, empName, companyName, department, location, language } = req.body || {};

    if (!empName) {
      return res.status(400).json({ error: 'Missing required user details.' });
    }

    const identity = await resolveEligibleIdentity(empId, phone);
    if (!identity.ok) {
      if (req.files) Object.values(req.files).flat().forEach(f => cleanupLocalFile(f.path));
      return res.status(400).json({ error: identity.error });
    }
    const { cleanEmpId, cleanPhone } = identity;

    if (!req.files || !req.files['photo1']) {
      return res.status(400).json({ error: 'Photo 1 is required.' });
    }
    if (!req.files['photo2']) {
      return res.status(400).json({ error: 'Photo 2 is required.' });
    }
    if (!req.files['video']) {
      return res.status(400).json({ error: 'Video file is required.' });
    }

    if (req.files['photo1'][0].size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Photo 1 exceeds 5MB limit.' });
    }
    if (req.files['photo2'][0].size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Photo 2 exceeds 5MB limit.' });
    }
    if (req.files['video'][0].size > 40 * 1024 * 1024) {
      return res.status(400).json({ error: 'Video exceeds maximum size limit of 40MB.' });
    }

    // Identity anchor is Employee ID when present, otherwise Phone Number —
    // whichever one was validated against the whitelist above.
    const identityQuery = cleanEmpId ? { empId: cleanEmpId } : { phone: cleanPhone };
    let user = await User.findOne(identityQuery);
    if (!user) {
      user = await User.create({
        empId: cleanEmpId || undefined,
        phone: cleanPhone || undefined,
        empName: empName.trim(),
        city: (location || '').trim()
      });
    }

    const existingF1 = await Form1.findOne({ userId: user._id });
    if (existingF1) {
      Object.values(req.files).flat().forEach(f => cleanupLocalFile(f.path));
      return res.status(400).json({ error: 'Form 1 has already been submitted by this user.' });
    }

    // User-specific R2 folder: empId_INITIALS (or last4phone_INITIALS if no ID)
    const userFolder = getUserFolder(cleanEmpId, empName, cleanPhone);

    const photo1Name = `${userFolder}_photo1${path.extname(req.files['photo1'][0].originalname).toLowerCase()}`;
    const photo2Name = req.files['photo2'] ? `${userFolder}_photo2${path.extname(req.files['photo2'][0].originalname).toLowerCase()}` : '';
    const videoName = req.files['video'] ? `${userFolder}_video${path.extname(req.files['video'][0].originalname).toLowerCase()}` : '';

    let photo1Url = `${R2_PUBLIC_URL}/${userFolder}/${photo1Name}`;
    let photo2Url = photo2Name ? `${R2_PUBLIC_URL}/${userFolder}/${photo2Name}` : '';
    let videoUrl = '';

    if (req.files['video']) {
      videoUrl = `${R2_PUBLIC_URL}/${userFolder}/${videoName}`;
      const r2Vid = await uploadFileToR2(req.files['video'][0].path, videoName, req.files['video'][0].mimetype, userFolder);
      if (r2Vid) { videoUrl = r2Vid; cleanupLocalFile(req.files['video'][0].path); }
    }

    // Stream uploads to Cloudflare R2 Bucket if credentials configured
    const r2P1 = await uploadFileToR2(req.files['photo1'][0].path, photo1Name, req.files['photo1'][0].mimetype, userFolder);
    if (r2P1) { photo1Url = r2P1; cleanupLocalFile(req.files['photo1'][0].path); }

    if (req.files['photo2']) {
      const r2P2 = await uploadFileToR2(req.files['photo2'][0].path, photo2Name, req.files['photo2'][0].mimetype, userFolder);
      if (r2P2) { photo2Url = r2P2; cleanupLocalFile(req.files['photo2'][0].path); }
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const submission = await Form1.create({
      userId: user._id,
      empId: cleanEmpId,
      phone: cleanPhone,
      companyName: (companyName || '').trim(),
      department: (department || '').trim(),
      photo1Url,
      photo2Url,
      videoUrl,
      language: language || 'en',
      ip
    });

    await recordAuditLog(req, `New Form 1 Submission by ${empName} (${cleanEmpId || cleanPhone})`, 'Public User');

    res.json({ success: true, submissionId: submission._id });
  } catch (err) {
    console.error('Form1 error:', err);
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Form 2 Submission — Chairman Invites Your Thoughts
app.post('/api/submissions/form2', (req, res, next) => {
  upload.single('optionalFile')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File exceeds the maximum allowed size.' });
      }
      return res.status(400).json({ error: err.message || 'File upload error.' });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { empId, phone, empName, companyName, department, location, thoughts, language } = req.body || {};

    if (!empName) {
      return res.status(400).json({ error: 'Missing required user details.' });
    }
    if (!thoughts || !thoughts.trim()) {
      if (req.file) cleanupLocalFile(req.file.path);
      return res.status(400).json({ error: 'Please share your thoughts (required).' });
    }
    if (thoughts.trim().length > 2000) {
      if (req.file) cleanupLocalFile(req.file.path);
      return res.status(400).json({ error: 'Thoughts must be 2000 characters or less.' });
    }

    const identity = await resolveEligibleIdentity(empId, phone);
    if (!identity.ok) {
      if (req.file) cleanupLocalFile(req.file.path);
      return res.status(400).json({ error: identity.error });
    }
    const { cleanEmpId, cleanPhone } = identity;

    // Identity anchor is Employee ID when present, otherwise Phone Number.
    const identityQuery = cleanEmpId ? { empId: cleanEmpId } : { phone: cleanPhone };
    let user = await User.findOne(identityQuery);
    if (!user) {
      user = await User.create({
        empId: cleanEmpId || undefined,
        phone: cleanPhone || undefined,
        empName: empName.trim(),
        city: location || ''
      });
    }

    const existingF2 = await Form2.findOne({ userId: user._id });
    if (existingF2) {
      if (req.file) cleanupLocalFile(req.file.path);
      return res.status(400).json({ error: 'Form 2 has already been submitted by this user.' });
    }

    const userFolder2 = getUserFolder(cleanEmpId, empName, cleanPhone);

    let optionalFileUrl = '';
    if (req.file) {
      if (req.file.size > 50 * 1024 * 1024) {
        cleanupLocalFile(req.file.path);
        return res.status(400).json({ error: 'File exceeds maximum size limit of 50MB.' });
      }
      const attachmentName = `${userFolder2}_attachment${path.extname(req.file.originalname).toLowerCase()}`;
      optionalFileUrl = `${R2_PUBLIC_URL}/${userFolder2}/${attachmentName}`;
      const r2File = await uploadFileToR2(req.file.path, attachmentName, req.file.mimetype, userFolder2);
      if (r2File) { optionalFileUrl = r2File; cleanupLocalFile(req.file.path); }
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const submission = await Form2.create({
      userId: user._id,
      empId: cleanEmpId,
      phone: cleanPhone,
      companyName: (companyName || '').trim(),
      department: (department || '').trim(),
      location: (location || '').trim(),
      thoughts: thoughts.trim(),
      optionalFileUrl,
      language: language || 'en',
      ip
    });

    await recordAuditLog(req, `New Form 2 Submission by ${empName} (${cleanEmpId || cleanPhone})`, 'Public User');

    res.json({ success: true, submissionId: submission._id });
  } catch (err) {
    console.error('Form2 error:', err);
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── ADMIN ROUTES (require x-admin-key header + nginx basic auth) ──
app.use('/api/admin', requireAdmin);

// Eligibility whitelist management — client supplies the full Employee ID list
// (~4950) and the phone-number list for employees with no ID (~50). Each
// upload replaces the whole list rather than merging, since the client sends
// the final list each time.
app.post('/api/admin/whitelist/employees', whitelistUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    const empIds = parseWhitelistFile(req.file.buffer);
    await AllowedEmployee.deleteMany({});
    if (empIds.length) await AllowedEmployee.insertMany(empIds.map(empId => ({ empId })), { ordered: false });
    await recordAuditLog(req, `Uploaded Employee ID whitelist (${empIds.length} entries)`, req.adminUser);
    res.json({ success: true, count: empIds.length });
  } catch (err) {
    console.error('Whitelist upload error:', err);
    res.status(500).json({ error: 'Failed to process the uploaded file.' });
  }
});

app.post('/api/admin/whitelist/phones', whitelistUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    const phones = parseWhitelistFile(req.file.buffer);
    await AllowedPhone.deleteMany({});
    if (phones.length) await AllowedPhone.insertMany(phones.map(phone => ({ phone })), { ordered: false });
    await recordAuditLog(req, `Uploaded Phone Number whitelist (${phones.length} entries)`, req.adminUser);
    res.json({ success: true, count: phones.length });
  } catch (err) {
    console.error('Whitelist upload error:', err);
    res.status(500).json({ error: 'Failed to process the uploaded file.' });
  }
});

app.get('/api/admin/whitelist/counts', async (req, res) => {
  const [employees, phones] = await Promise.all([
    AllowedEmployee.countDocuments(),
    AllowedPhone.countDocuments()
  ]);
  res.json({ employees, phones });
});

// R2 object key doesn't allow browser-side CORS fetches, so both media routes
// below validate the requested URL belongs to our bucket before touching R2.
function r2KeyFromUrl(url) {
  const prefix = `${R2_PUBLIC_URL}/`;
  if (typeof url !== 'string' || !url.startsWith(prefix)) return null;
  return url.slice(prefix.length);
}

// Generates a short-lived signed URL so admins can view private R2 media
// (<img>/<video> src) without making the bucket publicly readable.
app.get('/api/admin/media-url', async (req, res) => {
  try {
    if (!r2Client) {
      return res.status(503).json({ error: 'R2 storage not configured.' });
    }
    const key = r2KeyFromUrl(req.query.url);
    if (!key) {
      return res.status(400).json({ error: 'Invalid media URL.' });
    }

    const command = new GetObjectCommand({ Bucket: R2_BUCKET, Key: key });
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });
    res.json({ url: signedUrl });
  } catch (err) {
    console.error('Media URL sign error:', err);
    res.status(500).json({ error: 'Failed to generate media URL.' });
  }
});

// Streams the R2 object through our own server (server-to-server fetch has no
// CORS restriction) so the browser can force-download it as a same-origin response.
app.get('/api/admin/media-download', async (req, res) => {
  try {
    if (!r2Client) {
      return res.status(503).json({ error: 'R2 storage not configured.' });
    }
    const key = r2KeyFromUrl(req.query.url);
    if (!key) {
      return res.status(400).json({ error: 'Invalid media URL.' });
    }

    const command = new GetObjectCommand({ Bucket: R2_BUCKET, Key: key });
    const object = await r2Client.send(command);

    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(key)}"`);
    res.setHeader('Content-Type', object.ContentType || 'application/octet-stream');
    if (object.ContentLength) res.setHeader('Content-Length', object.ContentLength);
    object.Body.pipe(res);
  } catch (err) {
    console.error('Media download error:', err);
    res.status(500).json({ error: 'Failed to download media.' });
  }
});

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Generic action logger for the admin panel — lets the frontend record
// fine-grained activity (login, logout, viewing a profile, etc.) with the
// real authenticated username attached, not a hardcoded label.
app.post('/api/admin/audit-log', async (req, res) => {
  try {
    const detail = (req.body && req.body.detail || '').toString().trim().slice(0, 300);
    if (!detail) return res.status(400).json({ error: 'detail is required' });
    await recordAuditLog(req, detail, req.adminUser);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin Get Users Table
app.get('/api/admin/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    const { search, tag, formType } = req.query;

    let query = {};
    if (search) {
      const safeSearch = escapeRegex(search.toString()).slice(0, 100);
      query.$or = [
        { empName: new RegExp(safeSearch, 'i') },
        { empId: new RegExp(safeSearch, 'i') },
        { phone: new RegExp(safeSearch, 'i') },
        { email: new RegExp(safeSearch, 'i') },
        { city: new RegExp(safeSearch, 'i') }
      ];
    }
    if (tag) {
      query.tags = tag;
    }

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

    const result = await Promise.all(users.map(async (user) => {
      const f1 = await Form1.findOne({ userId: user._id }).lean();
      const f2 = await Form2.findOne({ userId: user._id }).lean();
      
      if (formType === 'form1' && !f1) return null;
      if (formType === 'form2' && !f2) return null;

      return {
        id: user._id,
        empId: user.empId,
        empName: user.empName,
        email: user.email,
        phone: user.phone || 'N/A',
        city: user.city || 'N/A',
        familyMembers: user.familyMembers || 1,
        tags: user.tags || [],
        createdAt: user.createdAt,
        form1: f1 ? {
          submittedAt: f1.submittedAt,
          companyName: f1.companyName || '',
          department: f1.department || '',
          photo1Url: f1.photo1Url,
          photo2Url: f1.photo2Url,
          videoUrl: f1.videoUrl || '',
          ceoReflection: f1.ceoReflection || '',
          language: f1.language,
          ip: f1.ip || ''
        } : null,
        form2: f2 ? {
          submittedAt: f2.submittedAt,
          companyName: f2.companyName || '',
          department: f2.department || '',
          location: f2.location || '',
          thoughts: f2.thoughts || '',
          optionalFileUrl: f2.optionalFileUrl || '',
          language: f2.language,
          ip: f2.ip || ''
        } : null
      };
    }));

    const filteredResult = result.filter(item => item !== null);

    res.json({
      users: filteredResult,
      totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Update Tags for User
app.patch('/api/admin/users/:id/tags', async (req, res) => {
  try {
    const { tags } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { tags }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await recordAuditLog(req, `Updated tags for user ${user.empName} (${user.empId}) to: [${tags.join(', ')}]`, req.adminUser);
    res.json({ success: true, tags: user.tags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin Overview KPIs
app.get('/api/admin/overview', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const form1Count = await Form1.countDocuments();
    const form2Count = await Form2.countDocuments();
    const recentLogs = await AuditLog.find().sort({ timestamp: -1 }).limit(5);

    res.json({
      totalUsers,
      form1Count,
      form2Count,
      recentLogs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin Audit Logs (READ ONLY - NO DELETE API)
app.get('/api/admin/audit-logs', async (req, res) => {
  try {
    // Only admin-performed actions belong here — public form submissions have
    // their own trail (visible in the Users Directory) and would just be noise.
    const logs = await AuditLog.find({ username: { $ne: 'Public User' } }).sort({ timestamp: -1 }).limit(200);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin Settings
app.get('/api/admin/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.put('/api/admin/settings', async (req, res) => {
  try {
    const { captchaEnabled, googleAnalyticsId, customTags } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    settings.captchaEnabled = captchaEnabled;
    settings.googleAnalyticsId = googleAnalyticsId;
    if (customTags) settings.customTags = customTags;
    await settings.save();

    await recordAuditLog(req, `Updated System Settings (Captcha: ${captchaEnabled}, GA: ${googleAnalyticsId})`, req.adminUser);
    res.json({ success: true, settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Dedicated Tag Management Endpoints (Real-time MongoDB CRUD)
app.get('/api/admin/tags', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ customTags: settings.customTags || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/api/admin/tags', async (req, res) => {
  try {
    const { tag } = req.body;
    if (!tag || !tag.trim()) return res.status(400).json({ error: 'Tag name is required' });
    const cleanTag = tag.trim();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }
    if (!settings.customTags.includes(cleanTag)) {
      settings.customTags.push(cleanTag);
      await settings.save();
      await recordAuditLog(req, `Added new system classification tag: "${cleanTag}"`, req.adminUser);
    }
    res.json({ success: true, customTags: settings.customTags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.delete('/api/admin/tags/:tag', async (req, res) => {
  try {
    const tagToRemove = decodeURIComponent(req.params.tag);
    let settings = await Settings.findOne();
    if (settings) {
      settings.customTags = settings.customTags.filter(t => t !== tagToRemove);
      await settings.save();
      await recordAuditLog(req, `Removed classification tag: "${tagToRemove}"`, req.adminUser);
    }
    res.json({ success: true, customTags: settings ? settings.customTags : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── EXPORT ENDPOINTS ──

app.get('/api/admin/export/users', exportLimiter, async (req, res) => {
  try {
    const format = req.query.format || 'csv';
    const users = await User.find().lean();
    
    const rows = await Promise.all(users.map(async u => {
      const f1 = await Form1.findOne({ userId: u._id });
      const f2 = await Form2.findOne({ userId: u._id });
      return {
        'User ID': u._id.toString(),
        'Emp ID': u.empId,
        'Name': u.empName,
        'Email': u.email,
        'Phone': u.phone || '',
        'City': u.city || '',
        'Form 1 Status': f1 ? 'Submitted' : 'Not Filled',
        'Form 1 Submitted At': f1 ? new Date(f1.submittedAt).toLocaleString() : '',
        'Form 2 Status': f2 ? 'Submitted' : 'Not Filled',
        'Form 2 Submitted At': f2 ? new Date(f2.submittedAt).toLocaleString() : '',
        'Tags': (u.tags || []).join(', '),
        'Registered At': new Date(u.createdAt).toLocaleString()
      };
    }));

    await recordAuditLog(req, `Exported Users Data in format: ${format.toUpperCase()}`, req.adminUser);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    if (format === 'excel' || format === 'xlsx') {
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="kando_users.xlsx"');
      return res.send(buffer);
    } else {
      const csv = XLSX.utils.sheet_to_csv(ws);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="kando_users.csv"');
      return res.send(csv);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PDF Export Endpoint (Req 2)
app.get('/api/admin/export/pdf', exportLimiter, async (req, res) => {
  try {
    const users = await User.find().lean();
    await recordAuditLog(req, 'Generated Candidate Directory PDF Report', req.adminUser);

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Yamaha Kando Day 2026 - Users Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
          h1 { color: #0052CC; text-align: center; margin-bottom: 4px; }
          p { text-align: center; color: #555; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #091A44; color: #00E5FF; }
          tr:nth-child(even) { background: #f9f9f9; }
        </style>
      </head>
      <body onload="window.print()">
        <h1>Yamaha Day 2026 - Registered Candidates Directory Report</h1>
        <p>Generated Timestamp: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>City Location</th>
              <th>Form 1 Status</th>
              <th>Form 2 Status</th>
              <th>Assigned Tag</th>
            </tr>
          </thead>
          <tbody>
    `;

    for (const u of users) {
      const f1 = await Form1.findOne({ userId: u._id });
      const f2 = await Form2.findOne({ userId: u._id });
      html += `
        <tr>
          <td><strong>${u.empId || u.phone || ''}</strong></td>
          <td>${u.empName}</td>
          <td>${u.email || ''}</td>
          <td>${u.city || 'N/A'}</td>
          <td>${f1 ? '✓ Submitted' : 'Not Filled'}</td>
          <td>${f2 ? '✓ Submitted' : 'Not Filled'}</td>
          <td>${(u.tags || []).join(', ') || 'None'}</td>
        </tr>
      `;
    }

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Streams each R2 object straight into the zip response (R2 -> server -> browser),
// so nothing ever touches local disk — safe at any user count regardless of
// server storage size.
async function appendR2FileToArchive(archive, url, name) {
  const key = r2KeyFromUrl(url);
  if (!key || !r2Client) return;
  try {
    const object = await r2Client.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    archive.append(object.Body, { name });
  } catch (err) {
    console.error(`ZIP export: failed to fetch ${key} from R2:`, err.message);
  }
}

// Builds the CSV+media zip into the given archiver instance and finalizes it.
// Shared by the direct-download route and the background email-export job.
async function buildExportArchive(archive) {
  const users = await User.find().lean();
  const rows = [];

  for (const u of users) {
    const f1 = await Form1.findOne({ userId: u._id });
    const f2 = await Form2.findOne({ userId: u._id });

    const userKey = u.empId || u.phone || u._id.toString();

    rows.push({
      'Emp ID': u.empId,
      'Phone': u.phone || '',
      'Name': u.empName,
      'Form 1 Photo 1': f1 ? f1.photo1Url : '',
      'Form 1 Photo 2': f1 ? f1.photo2Url : '',
      'Form 1 Video': f1 ? f1.videoUrl : '',
      'Form 2 Attachment': f2 ? f2.optionalFileUrl : ''
    });

    const empFolder = `media/${userKey}`;
    if (f1?.photo1Url) await appendR2FileToArchive(archive, f1.photo1Url, `${empFolder}/${userKey}_photo1${path.extname(f1.photo1Url)}`);
    if (f1?.photo2Url) await appendR2FileToArchive(archive, f1.photo2Url, `${empFolder}/${userKey}_photo2${path.extname(f1.photo2Url)}`);
    if (f1?.videoUrl) await appendR2FileToArchive(archive, f1.videoUrl, `${empFolder}/${userKey}_video${path.extname(f1.videoUrl)}`);
    if (f2?.optionalFileUrl) await appendR2FileToArchive(archive, f2.optionalFileUrl, `${empFolder}/${userKey}_attachment${path.extname(f2.optionalFileUrl)}`);
  }

  const ws = XLSX.utils.json_to_sheet(rows);
  const csvContent = XLSX.utils.sheet_to_csv(ws);
  archive.append(csvContent, { name: 'users_summary.csv' });

  archive.finalize();
}

app.get('/api/admin/export/zip', exportLimiter, async (req, res) => {
  try {
    await recordAuditLog(req, `Exported CSV + ZIP Media Assets Archive`, req.adminUser);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="kando_submissions_assets.zip"');

    const archive = getZipArchive();
    archive.pipe(res);
    await buildExportArchive(archive);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Builds the same zip but uploads it straight to R2 (never touching local disk),
// then emails the requester a presigned download link instead of the file itself
// — large exports (5000 users, photos + video) can run into GBs, way past any
// email attachment limit.
async function buildAndEmailExport(email) {
  const timestamp = Date.now();
  const key = `exports/kando_export_${timestamp}.zip`;

  // archiver's ZipArchive isn't a real Node Readable (lib-storage rejects it
  // outright), so pipe it through an actual PassThrough stream for the upload.
  const archive = getZipArchive();
  const passThrough = new PassThrough();
  archive.pipe(passThrough);

  const upload = new Upload({
    client: r2Client,
    params: { Bucket: R2_BUCKET, Key: key, Body: passThrough, ContentType: 'application/zip' }
  });

  await Promise.all([upload.done(), buildExportArchive(archive)]);

  const signedUrl = await getSignedUrl(
    r2Client,
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }),
    { expiresIn: 24 * 60 * 60 }
  );

  await mailTransporter.sendMail({
    from: `Kando From Home <${SMTP_USER}>`,
    to: email,
    subject: 'Kando From Home — CSV + Media Export',
    html: `
      <p>Your CSV + ZIP media export is ready.</p>
      <p><a href="${signedUrl}">Download the export</a></p>
      <p style="color:#888;font-size:12px">This link expires in 24 hours.</p>
    `
  });
}

app.post('/api/admin/export/zip-email', exportLimiter, async (req, res) => {
  const { email } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  if (!r2Client) {
    return res.status(503).json({ error: 'R2 storage not configured.' });
  }
  if (!mailTransporter) {
    return res.status(503).json({ error: 'Email is not configured on the server.' });
  }

  // Respond immediately — building the zip and sending the email can take a
  // while for large exports, so the admin gets a toast, not a spinner.
  res.json({ success: true, message: 'Export started. The download link will be emailed shortly.' });

  recordAuditLog(req, `Requested CSV + ZIP export via email to ${email}`, req.adminUser).catch(() => {});

  buildAndEmailExport(email).catch(err => {
    console.error('Email export failed:', err);
  });
});

// SPA Fallback to index.html for client routing (Exclude /api routes!)
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: `API route ${req.path} not found` });
  }
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Kando From Home API Server Running');
  }
});

// Listen explicitly on 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
