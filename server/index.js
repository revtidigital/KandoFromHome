const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiverModule = require('archiver');
const XLSX = require('xlsx');

const createArchiver = typeof archiverModule === 'function' ? archiverModule : (archiverModule.default || archiverModule.create);
function getZipArchive() {
  if (typeof createArchiver === 'function') {
    return createArchiver('zip', { zlib: { level: 9 } });
  }
  return new archiverModule.ZipArchive({ zlib: { level: 9 } });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
app.use('/uploads', express.static(uploadsDir));

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

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

async function uploadFileToR2(filePath, fileName, mimeType, userFolder) {
  if (!r2Client) return null;
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const folder = userFolder ? `uploads/${userFolder}` : 'uploads';
    const key = `${folder}/${Date.now()}-${fileName}`;
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
    .filter(w => w.length > 0)
    .map(w => w[0].toUpperCase())
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

const upload = multer({
  storage,
  limits: { fileSize: 55 * 1024 * 1024 } // 55MB max buffer
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kando_db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected to', MONGO_URI))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Schemas
const UserSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  empName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  city: { type: String },
  familyMembers: { type: Number, default: 1 },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Form1Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  empId: { type: String, required: true },
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
  empId: { type: String, required: true },
  companyName: { type: String, default: '' },
  department: { type: String, default: '' },
  location: { type: String, default: '' },
  thoughts: { type: String, default: '' },
  optionalFileUrl: { type: String, default: '' },
  language: { type: String, default: 'en' },
  submittedAt: { type: Date, default: Date.now },
  ip: { type: String }
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
    res.status(500).json({ error: err.message });
  }
});

// Check if user already submitted
app.get('/api/check-submission', async (req, res) => {
  try {
    const { empId, email } = req.query;
    if (!empId && !email) return res.json({ submitted: false });
    
    const user = await User.findOne({
      $or: [{ empId: empId || '' }, { email: email || '' }]
    });

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
    res.status(500).json({ error: err.message });
  }
});

// Form 1 Submission
app.post('/api/submissions/form1', upload.fields([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { empId, empName, email, phone, city, familyMembers, ceoReflection, language } = req.body || {};
    
    if (!empId || !empName || !email) {
      return res.status(400).json({ error: 'Missing required user details.' });
    }

    if (!req.files || !req.files['photo1']) {
      return res.status(400).json({ error: 'Photo 1 is required.' });
    }
    if (!req.files['photo2']) {
      return res.status(400).json({ error: 'Photo 2 is required.' });
    }
    if (!req.files['video']) {
      return res.status(400).json({ error: 'Video file is required.' });
    }

    if (req.files['photo1'][0].size > 50 * 1024 * 1024) {
      return res.status(400).json({ error: 'Photo 1 exceeds 50MB limit.' });
    }
    if (req.files['photo2'][0].size > 50 * 1024 * 1024) {
      return res.status(400).json({ error: 'Photo 2 exceeds 50MB limit.' });
    }
    if (req.files['video'][0].size > 50 * 1024 * 1024) {
      return res.status(400).json({ error: 'Video exceeds maximum size limit of 50MB.' });
    }

    const cleanEmpId = empId.toString().trim();
    const cleanEmail = email.toString().trim().toLowerCase();

    // Enforce Employee ID Uniqueness
    let user = await User.findOne({ empId: cleanEmpId });
    if (!user) {
      const emailUser = await User.findOne({ email: cleanEmail });
      if (emailUser && emailUser.empId !== cleanEmpId) {
        return res.status(400).json({ error: `Email address "${email}" is already registered under Employee ID (${emailUser.empId}).` });
      }
      user = await User.create({ empId: cleanEmpId, empName: empName.trim(), email: cleanEmail, phone, city, familyMembers: Number(familyMembers) || 1 });
    } else {
      if (user.email.toLowerCase() !== cleanEmail) {
        return res.status(400).json({ error: `Employee ID "${cleanEmpId}" is already registered to another employee (${user.empName}). Each Employee ID must be unique!` });
      }
    }

    const existingF1 = await Form1.findOne({ userId: user._id });
    if (existingF1) {
      return res.status(400).json({ error: 'Form 1 has already been submitted by this user.' });
    }

    // User-specific R2 folder: empId_INITIALS or last4phone_INITIALS
    const userFolder = getUserFolder(cleanEmpId, empName, phone);

    let photo1Url = `${R2_PUBLIC_URL}/${userFolder}/${req.files['photo1'][0].filename}`;
    let photo2Url = req.files['photo2'] ? `${R2_PUBLIC_URL}/${userFolder}/${req.files['photo2'][0].filename}` : '';
    let videoUrl = '';

    if (req.files['video']) {
      videoUrl = `${R2_PUBLIC_URL}/${userFolder}/${req.files['video'][0].filename}`;
      const r2Vid = await uploadFileToR2(req.files['video'][0].path, req.files['video'][0].filename, req.files['video'][0].mimetype, userFolder);
      if (r2Vid) videoUrl = r2Vid;
    }

    // Stream uploads to Cloudflare R2 Bucket if credentials configured
    const r2P1 = await uploadFileToR2(req.files['photo1'][0].path, req.files['photo1'][0].filename, req.files['photo1'][0].mimetype, userFolder);
    if (r2P1) photo1Url = r2P1;

    if (req.files['photo2']) {
      const r2P2 = await uploadFileToR2(req.files['photo2'][0].path, req.files['photo2'][0].filename, req.files['photo2'][0].mimetype, userFolder);
      if (r2P2) photo2Url = r2P2;
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const submission = await Form1.create({
      userId: user._id,
      empId,
      photo1Url,
      photo2Url,
      videoUrl,
      ceoReflection: ceoReflection || '',
      language: language || 'en',
      ip
    });

    await recordAuditLog(req, `New Form 1 Submission by ${empName} (${empId})`, 'Public User');

    res.json({ success: true, submissionId: submission._id });
  } catch (err) {
    console.error('Form1 error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Form 2 Submission — Chairman Invites Your Thoughts
app.post('/api/submissions/form2', upload.single('optionalFile'), async (req, res) => {
  try {
    const { empId, empName, email, phone, companyName, department, location, thoughts, language } = req.body || {};

    if (!empId || !empName || !email) {
      return res.status(400).json({ error: 'Missing required user details (empId, empName, email).' });
    }
    if (!thoughts || !thoughts.trim()) {
      return res.status(400).json({ error: 'Please share your thoughts (required).' });
    }
    if (thoughts.trim().length > 2000) {
      return res.status(400).json({ error: 'Thoughts must be 2000 characters or less.' });
    }

    const cleanEmpId = empId.toString().trim();
    const cleanEmail = email.toString().trim().toLowerCase();
    const userFolder2 = getUserFolder(cleanEmpId, empName, phone);

    let optionalFileUrl = '';
    if (req.file) {
      if (req.file.size > 50 * 1024 * 1024) {
        return res.status(400).json({ error: 'File exceeds maximum size limit of 50MB.' });
      }
      optionalFileUrl = `${R2_PUBLIC_URL}/${userFolder2}/${req.file.filename}`;
      const r2File = await uploadFileToR2(req.file.path, req.file.filename, req.file.mimetype, userFolder2);
      if (r2File) optionalFileUrl = r2File;
    }

    let user = await User.findOne({ empId: cleanEmpId });
    if (!user) {
      const emailUser = await User.findOne({ email: cleanEmail });
      if (emailUser && emailUser.empId !== cleanEmpId) {
        return res.status(400).json({ error: `Email address "${email}" is already registered under Employee ID (${emailUser.empId}).` });
      }
      user = await User.create({ empId: cleanEmpId, empName: empName.trim(), email: cleanEmail, phone: phone || '', city: location || '', familyMembers: 1 });
    } else {
      if (user.email.toLowerCase() !== cleanEmail) {
        return res.status(400).json({ error: `Employee ID "${cleanEmpId}" is already registered to another employee (${user.empName}). Each Employee ID must be unique!` });
      }
    }

    const existingF2 = await Form2.findOne({ userId: user._id });
    if (existingF2) {
      return res.status(400).json({ error: 'Form 2 has already been submitted by this user.' });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const submission = await Form2.create({
      userId: user._id,
      empId: cleanEmpId,
      companyName: (companyName || '').trim(),
      department: (department || '').trim(),
      location: (location || '').trim(),
      thoughts: thoughts.trim(),
      optionalFileUrl,
      language: language || 'en',
      ip
    });

    await recordAuditLog(req, `New Form 2 Submission by ${empName} (${empId})`, 'Public User');

    res.json({ success: true, submissionId: submission._id });
  } catch (err) {
    console.error('Form2 error:', err);
    res.status(500).json({ error: err.message });
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
      query.$or = [
        { empName: new RegExp(search, 'i') },
        { empId: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') }
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
          photo1Url: f1.photo1Url,
          photo2Url: f1.photo2Url,
          videoUrl: f1.videoUrl || '',
          ceoReflection: f1.ceoReflection || '',
          language: f1.language,
          ip: f1.ip || ''
        } : null,
        form2: f2 ? {
          submittedAt: f2.submittedAt,
          videoUrl: f2.videoUrl || '',
          ceoReflection: f2.ceoReflection || '',
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
    res.status(500).json({ error: err.message });
  }
});

// Update Tags for User
app.patch('/api/admin/users/:id/tags', async (req, res) => {
  try {
    const { tags } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { tags }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await recordAuditLog(req, `Updated tags for user ${user.empName} (${user.empId}) to: [${tags.join(', ')}]`, 'Admin');
    res.json({ success: true, tags: user.tags });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

// Admin Audit Logs (READ ONLY - NO DELETE API)
app.get('/api/admin/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(200);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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

    await recordAuditLog(req, `Updated System Settings (Captcha: ${captchaEnabled}, GA: ${googleAnalyticsId})`, 'Admin');
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
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
      await recordAuditLog(req, `Added new system classification tag: "${cleanTag}"`, 'Admin');
    }
    res.json({ success: true, customTags: settings.customTags });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/tags/:tag', async (req, res) => {
  try {
    const tagToRemove = decodeURIComponent(req.params.tag);
    let settings = await Settings.findOne();
    if (settings) {
      settings.customTags = settings.customTags.filter(t => t !== tagToRemove);
      await settings.save();
      await recordAuditLog(req, `Removed classification tag: "${tagToRemove}"`, 'Admin');
    }
    res.json({ success: true, customTags: settings ? settings.customTags : [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── EXPORT ENDPOINTS ──

app.get('/api/admin/export/users', async (req, res) => {
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

    await recordAuditLog(req, `Exported Users Data in format: ${format.toUpperCase()}`, 'Admin');

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
    res.status(500).json({ error: err.message });
  }
});

// PDF Export Endpoint (Req 2)
app.get('/api/admin/export/pdf', async (req, res) => {
  try {
    const users = await User.find().lean();
    await recordAuditLog(req, 'Generated Candidate Directory PDF Report', 'Admin');

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
          <td><strong>${u.empId}</strong></td>
          <td>${u.empName}</td>
          <td>${u.email}</td>
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
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/export/zip', async (req, res) => {
  try {
    await recordAuditLog(req, `Exported CSV + ZIP Media Assets Archive`, 'Admin');

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="kando_submissions_assets.zip"');

    const archive = getZipArchive();
    archive.pipe(res);

    const users = await User.find().lean();
    const rows = [];

    for (const u of users) {
      const f1 = await Form1.findOne({ userId: u._id });
      const f2 = await Form2.findOne({ userId: u._id });

      rows.push({
        'Emp ID': u.empId,
        'Name': u.empName,
        'Email': u.email,
        'Form 1 Photo 1': f1 ? f1.photo1Url : '',
        'Form 1 Photo 2': f1 ? f1.photo2Url : '',
        'Form 2 Video': f2 ? f2.videoUrl : ''
      });

      if (f1 && f1.photo1Url) {
        const file1 = path.join(uploadsDir, path.basename(f1.photo1Url));
        if (fs.existsSync(file1)) {
          archive.file(file1, { name: `media/${u.empId}_photo1${path.extname(file1)}` });
        }
        if (f1.photo2Url) {
          const file2 = path.join(uploadsDir, path.basename(f1.photo2Url));
          if (fs.existsSync(file2)) {
            archive.file(file2, { name: `media/${u.empId}_photo2${path.extname(file2)}` });
          }
        }
      }
      if (f2 && f2.videoUrl) {
        const fileVideo = path.join(uploadsDir, path.basename(f2.videoUrl));
        if (fs.existsSync(fileVideo)) {
          archive.file(fileVideo, { name: `media/${u.empId}_video${path.extname(fileVideo)}` });
        }
      }
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    archive.append(csvContent, { name: 'users_summary.csv' });

    archive.finalize();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
