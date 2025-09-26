// functions/api/ingest.js  — Cloudflare Pages Function

export const onRequestOptions = async ({ request }) => {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
};

export const onRequest = async ({ request, env }) => {
  const method = request.method.toUpperCase();
  const origin = request.headers.get("Origin") || "*";

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }
  if (method !== "POST") {
    return json({ ok: false, error: "Method Not Allowed" }, 405, origin);
  }

  try {
    const ct = (request.headers.get("content-type") || "").toLowerCase();
    let filename = "";
    let contentType = "text/csv";
    let data = "";

    if (ct.includes("application/json")) {
      const body = await request.json();
      filename = sanitize(body?.filename) || `upload_${Date.now()}.csv`;
      const raw = body?.data;
      data = typeof raw === "string" ? raw : JSON.stringify(raw ?? "");
      contentType = body?.contentType || (typeof raw === "string" ? "text/csv" : "application/json");
    } else if (ct.includes("text/plain") || ct.includes("text/csv")) {
      data = await request.text();
      filename = `upload_${Date.now()}.${ct.includes("csv") ? "csv" : "txt"}`;
      contentType = ct.includes("csv") ? "text/csv" : "text/plain";
    } else if (ct.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      const supplied = form.get("filename");
      if (file && typeof file === "object" && typeof file.text === "function") {
        data = await file.text();
        filename = sanitize(supplied || file.name || `upload_${Date.now()}`);
        contentType = file.type || "application/octet-stream";
      } else {
        return json({ ok: false, error: "No file provided" }, 400, origin);
      }
    } else {
      return json({ ok: false, error: "Unsupported Content-Type" }, 415, origin);
    }

    if (!data) return json({ ok: false, error: "Empty payload" }, 400, origin);

    const key = (filename || `upload_${Date.now()}`)
      .replace(/[\r\n]/g, " ").replace(/[\/\\]+/g, "_").trim();

    await env.DATA_BUCKET.put(key, data, {
      httpMetadata: { contentType: contentType || "application/octet-stream" },
    });

    return json({ ok: true, key }, 200, origin);
  } catch (err) {
    return json({ ok: false, error: String(err) }, 500, origin);
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

function json(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders({ headers: new Map([["Origin", origin]]) }) },
  });
}

function sanitize(name) {
  if (!name) return "";
  return String(name).replace(/[\r\n]/g, " ").replace(/[\/\\]+/g, "_").trim();
}
