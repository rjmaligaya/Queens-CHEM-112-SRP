import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure data dir
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.post('/api/ingest', async (req, res) => {
  try {
    const { filename, data, contentType } = req.body || {};
    if (!filename || !data) return res.status(400).json({ ok:false, error: 'Missing filename or data' });
    // basic filename sanitization
    const safe = filename.replace(/[^A-Za-z0-9._\- ]/g, '_');
    const dest = path.join(DATA_DIR, safe);
    fs.writeFileSync(dest, data, 'utf8');
    return res.json({ ok:true, saved: path.basename(dest) });
  } catch (e) {
    console.error('Ingest error:', e);
    return res.status(500).json({ ok:false, error: String(e) });
  }
});

app.use('/', express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
  console.log(`CHEM112 uploader listening on http://localhost:${PORT}`);
});
