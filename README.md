# NDC Batch 28 Portal — production package
FastAPI + PostgreSQL 16 + vanilla-JS SPA · Docker Compose · Caddy (automatic HTTPS) · daily DB backups

## Free hosting: Neon + Render + Vercel
See HOSTING-FREE.md (this is the recommended path). The Docker/VPS route below is the paid alternative.

## Deploy (any $5 VPS with Docker, e.g. Hetzner/DigitalOcean)
1. Point your domain's A record to the server IP.
2. `cp .env.example .env` and fill SECRET_KEY, SUPER_EMAIL, SUPER_PASSWORD, DOMAIN, DB_PASSWORD (delete the DATABASE_URL/PROD lines).
3. `docker compose run --rm app python manage.py set-domain YOUR.DOMAIN` (fixes SEO files; or edit the 3 files by hand), then replace `static/logo.svg` with the official crest.
4. `docker compose up -d --build` → open https://YOUR.DOMAIN and log in with SUPER_EMAIL / SUPER_PASSWORD.
5. Admin → WhatsApp groups: add one invite link per group number.
Migrations run automatically on every start.

## Database management
| Task | Command |
|---|---|
| Counts / health | `docker compose exec app python manage.py stats` |
| Apply migrations | `docker compose exec app python manage.py migrate` |
| Manual backup | `docker compose exec app python manage.py backup /tmp/x.dump` |
| Restore | `docker compose exec app python manage.py restore /tmp/x.dump` |
| Reset a forgotten password | `docker compose exec app python manage.py reset-password a@b.com` |
| Extra super admin | `docker compose exec app python manage.py create-super me@x.com` |
Automatic daily dumps land in `./backups` (7 daily / 4 weekly / 6 monthly kept). **Copy `./backups` and the `uploads` volume off the server weekly** — a backup on the same disk is not a backup.
Schema changes: add `migrations/002_name.sql`; it is applied once, in order, and recorded in `schema_migrations`.

## Local dev & tests
`docker run -d -p 5432:5432 -e POSTGRES_USER=ndc -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=ndc postgres:16-alpine`
`pip install -r requirements-dev.txt && uvicorn main:app --env-file .env --reload` · tests: `pytest -q tests` (wipes the DB it points at — never aim it at production).

## Security summary
scrypt password hashing · HttpOnly+SameSite=Strict+Secure cookies · X-Req header CSRF guard · DB-backed login throttling (works across workers) · strict CSP/HSTS/nosniff headers · image magic-byte validation · photos served only to owner/admins · parameterised SQL everywhere · CSV-injection-safe export · API docs off · non-root container.
# ndc28
