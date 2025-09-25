// Netlify function: /.netlify/functions/ingest
export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const body = JSON.parse(event.body || '{}');
    const { filename, data } = body;
    if (!filename || !data) return { statusCode: 400, body: JSON.stringify({ ok:false, error:'missing fields' }) };
    // For demo: write to /tmp; in real deployment, upload to storage (S3/B2)
    const fs = await import('fs');
    const path = await import('path');
    const safe = filename.replace(/[^A-Za-z0-9._\- ]/g, '_');
    const dest = path.join('/tmp', safe);
    fs.writeFileSync(dest, data, 'utf8');
    return { statusCode: 200, body: JSON.stringify({ ok:true, saved: path.basename(dest) }) };
  } catch(e){
    return { statusCode: 500, body: JSON.stringify({ ok:false, error: String(e) }) };
  }
}
