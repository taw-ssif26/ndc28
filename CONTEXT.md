## Project: NDC Batch 28 Portal
## Stack: FastAPI + PostgreSQL 16 (psycopg pool, SQL migrations) + vanilla JS SPA; Docker Compose + Caddy + pg backup sidecar
## Current State: free-tier ready (Neon + Render + Vercel via HOSTING-FREE.md); images stored in Postgres (re-encoded, EXIF stripped); Vercel proxies /api so cookies stay same-site; 2 tests pass; frontend not browser-tested
## Active Problem: none
## Key Files: main.py (API/auth/security), manage.py (DB CLI), migrations/ (schema), static/ (landing+SPA, logo.svg = placeholder crest), docker-compose.yml, Caddyfile, tests/test_flow.py, README.md (deploy + DB ops)
## Decisions Made: Postgres+raw SQL migrations over SQLite/Alembic (fewer moving parts); scrypt stdlib; login throttle in DB (multi-worker safe); Caddy for auto-HTTPS; uploads on a volume
## Next Step: push to GitHub, deploy Neon -> Render -> Vercel, add UptimeRobot, set group links, weekly pg_dump
- Decision: images in Neon bytea (Render free has no disk); login throttle keyed per identifier (XFF spoofable)
