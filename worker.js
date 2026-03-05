export default {
  async fetch(request, env) {
    const corsHeaders = buildCorsHeaders(request);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/api/waitlist') {
      return json({ error: 'Not found' }, 404, corsHeaders);
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, corsHeaders);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON payload' }, 400, corsHeaders);
    }

    const email = String(body?.email || '').trim().toLowerCase();
    if (!isValidEmail(email)) {
      return json({ error: 'Please provide a valid email address.' }, 400, corsHeaders);
    }

    const createdAt = new Date().toISOString();
    const record = { email, createdAt, source: body?.source || 'soberanoai-landing' };

    if (env.WAITLIST_KV) {
      await env.WAITLIST_KV.put(`waitlist:${email}`, JSON.stringify(record));
    }

    if (env.WAITLIST_WEBHOOK_URL) {
      await fetch(env.WAITLIST_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(record)
      });
    }

    return json({ ok: true, message: 'Joined waitlist successfully.' }, 200, corsHeaders);
  }
};

function json(payload, status, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...extraHeaders
    }
  });
}

function buildCorsHeaders(request) {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
