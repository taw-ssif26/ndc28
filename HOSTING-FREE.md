# Free hosting: Neon (database) + Render (API) + Vercel (frontend)
Browser → Vercel (static site, proxies /api and /media) → Render (FastAPI) → Neon (PostgreSQL, also stores all images)

## 1. Neon
Create a project (region closest to Singapore) → Dashboard → Connect → copy the **pooled** connection string (host contains `-pooler`). Keep it secret.

## 2. GitHub
```bash
cd ndc28 && git init && git add . && git commit -m "NDC batch 28 portal"
git branch -M main && git remote add origin https://github.com/YOU/ndc28.git && git push -u origin main
```
(Make the repo **private**. `.env` is git-ignored.)

## 3. Render → New → Web Service → your repo
| Field | Value |
|---|---|
| Name | `ndc28-api` (the URL must be `https://ndc28-api.onrender.com`; if Render gives another URL, put it in `static/vercel.json` in both places and push) |
| Runtime / Plan | Python 3 / **Free** |
| Build command | `pip install -r requirements.txt` |
| Start command | `uvicorn main:app --host 0.0.0.0 --port $PORT --proxy-headers --forwarded-allow-ips=*` |
| Health check path | `/api/health` |
Environment variables: `PYTHON_VERSION=3.12.8`, `PROD=1`, `DATABASE_URL=<Neon pooled string>`, `SECRET_KEY=<python3 -c "import secrets;print(secrets.token_hex(32))">`, `SUPER_EMAIL=<yours>`, `SUPER_PASSWORD=<12+ chars>`.
Deploy. Open `https://ndc28-api.onrender.com/api/health` → `{"ok":true}`. Migrations and your super admin are created on first boot.

## 4. Vercel → Add New → Project → same repo
Root Directory: **`static`** · Framework Preset: **Other** · no build command · Deploy.
Your site is `https://<project>.vercel.app`. Then fix SEO URLs and push:
`sed -i 's#YOUR-DOMAIN#<project>.vercel.app#g' static/index.html static/robots.txt static/sitemap.xml && git commit -am domain && git push`

## 5. First run
Open the Vercel URL → Log in with SUPER_EMAIL / SUPER_PASSWORD → Admin → WhatsApp groups → add links.

## 6. Keep it awake (important)
Render free sleeps after 15 min idle (first visit then waits ~50 s). Create a free UptimeRobot monitor: HTTP(s), `https://ndc28-api.onrender.com/api/health`, every 5 min. One always-on free service fits Render's 750 h/month.

## 7. Backups (Neon free has no scheduled dumps)
Weekly, from your laptop (install `postgresql-client`; use Neon's **direct** string, without `-pooler`):
`pg_dump "<direct string>" -Fc -f batch28-$(date +%F).dump`
Restore: `pg_restore --clean --if-exists --no-owner -d "<direct string>" file.dump`. Images live in the database, so one dump covers everything.

## Limits to know
Neon free = 0.5 GB (photos are resized to ≤600 px / gallery ≤1400 px JPEG ≈ 50–200 KB, so thousands fit) · Neon sleeps after 5 min idle, first query ~1 s · custom domain: add it in Vercel and update `vercel.json`/SEO URLs.
