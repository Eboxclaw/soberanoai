# soberanoai

Landing page for SoberanoAI with a Cloudflare Worker-powered waitlist endpoint.

## Cloudflare Worker setup

1. Install Wrangler:
   ```bash
   npm install -g wrangler
   ```
2. (Recommended) Create a KV namespace for durable waitlist storage:
   ```bash
   wrangler kv namespace create WAITLIST_KV
   wrangler kv namespace create WAITLIST_KV --preview
   ```
3. If using KV, uncomment `[[kv_namespaces]]` in `wrangler.toml` and paste your IDs.
4. (Recommended) Set allowed frontend origins in `wrangler.toml`:
   ```toml
   ALLOWED_ORIGINS = "https://your-domain.com,https://www.your-domain.com"
   ```
5. Deploy the worker:
   ```bash
   wrangler deploy
   ```
6. Add your worker endpoint to the landing page (any of these):
   - Set `window.WAITLIST_ENDPOINT` before the main script, or
   - Add `?waitlistEndpoint=https://<worker-domain>/api/waitlist` to the page URL.

## Local preview

Serve the static page:
```bash
python -m http.server 8000
```

Run worker locally:
```bash
wrangler dev
```

## Waitlist API

- `POST /api/waitlist`
- Payload:
  ```json
  { "email": "user@example.com", "source": "soberanoai-landing" }
  ```
- Responses:
  - `200` with `ok: true` when joined
  - `200` with `alreadyJoined: true` for duplicate submissions
  - `400` for invalid payload/email
  - `500` for storage/runtime failures
