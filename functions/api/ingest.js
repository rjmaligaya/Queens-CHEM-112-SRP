// functions/api/ingest.js — Cloudflare Pages Function to write to R2
// Bind R2 in Pages settings with variable name DATA_BUCKET.

export const onRequestOptions = async ({ request }) => {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
};

export const onRequest = async ({ request, env }) => {
  const method = request.method.toUpperCase();
  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }
  if (method !== "POST") {
    return json({ ok: false, error: "Method Not Allowed" }, 405, request);
  }

  try {
    const ct = (request.headers.get("content-type") || "").toLowerCase();
    let filename = "";
    let contentType = "text/csv";
    let data = "";

// text/csv or text/plain (preferred: text/csv)
    if (ct.includes("text/csv") || ct.includes("text/plain")) {
      data = await request.text();
      contentType = ct.includes("csv") ? "text/csv" : "text/plain";
      filename = suggestFileName(request, contentType);
    }
// JSON with { filename, data }
    else if (ct.includes("application/json")) {
      const body = await request.json();
      const raw = body?.data;
      data = typeof raw === "string" ? raw : JSON.stringify(raw ?? "");
      contentType = body?.contentType || (typeof raw === "string" ? "text/csv" : "application/json");
      filename = sanitize(body?.filename) || suggestFileName(request, contentType);
    }
// Multipart: field 'file' and optional 'filename'
    else if (ct.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      const supplied = form.get("filename");
      if (file && typeof file === "object" && typeof file.text === "function") {
        data = await file.text();
        contentType = file.type || "application/octet-stream";
        filename = sanitize(supplied || file.name) || suggestFileName(request, contentType);
      } else {
        return json({ ok: false, error: "No file provided" }, 400, request);
      }
    } else {
      return json({ ok: false, error: "Unsupported Content-Type" }, 415, request);
    }

    if (!data || !data.trim()) {
      return json({ ok: false, error: "Empty payload" }, 400, request);
    }

    // Enforce "at least 2 lines" for CSV (header + >=1 row)
    if (contentType.startsWith("text/csv")) {
      const lines = data.trim().split(/\r?\n/);
      if (lines.length < 2) {
        return json({ ok: false, error: "CSV has headers but no data rows" }, 422, request);
      }
    }

    const key = filename;
    await env.DATA_BUCKET.put(key, data, {
      httpMetadata: { contentType: contentType || "application/octet-stream" },
    });

    return json({ ok: true, key }, 201, request);
  } catch (err) {
    return json({ ok: false, error: String(err) }, 500, request);
  }
};

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

function json(obj, status, request) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders(request) },
  });
}

function sanitize(name) {
  if (!name) return "";
  return String(name).replace(/[\r\n]/g, " ").replace(/[\/\\]+/g, "_").trim();
}

function suggestFileName(request, contentType) {
  const url = new URL(request.url);
  const student = url.searchParams.get("student") || "unknown";
  const week = url.searchParams.get("week") || "unknown";
  const now = new Date().toISOString().replaceAll(":", "-");
  const ext = contentType.includes("csv") ? "csv" : (contentType.includes("json") ? "json" : "txt");
  return `results/${week}/${student}/${now}.${ext}`;
}
