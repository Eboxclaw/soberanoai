# soberanoai

Landing page for SoberanoAI with a Cloudflare Worker-powered waitlist endpoint.

## Cloudflare Worker setup

1. Install Wrangler:
   ```bash
   npm install -g wrangler
   ```
2. Create a KV namespace (optional but recommended for storing emails):
   ```bash
   wrangler kv namespace create WAITLIST_KV
   wrangler kv namespace create WAITLIST_KV --preview
   ```
3. Replace IDs in `wrangler.toml` with your real namespace IDs.
4. Deploy the worker:
   ```bash
   wrangler deploy
   ```
5. Copy your deployed worker URL and update `WAITLIST_ENDPOINT` in `soberanoai.html`.

## Local preview

Serve the static page:
```bash
python -m http.server 8000
```

Run worker locally:
```bash
wrangler dev
```
