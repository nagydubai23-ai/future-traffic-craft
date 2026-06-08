# Deployment Scripts

Scripts used once to migrate data from Lovable Cloud → self-hosted Supabase
running on your Hetzner server via Coolify.

| Script | Where to run | Purpose |
| --- | --- | --- |
| `db-export.sh` | Local machine | Dump schema + data from Lovable Cloud Postgres |
| `storage-export.sh` | Local machine | Download all files from the `cms-images` bucket |
| `import.sh` | Hetzner server | Restore schema + data into the new Supabase Postgres |
| `storage-import.sh` | Hetzner server | Upload files back into the new `cms-images` bucket |

See `../DEPLOY.md` for the full step-by-step migration guide (in Arabic).

## Requirements (local machine)

- `pg_dump` 15+ (`brew install postgresql@15` or `apt install postgresql-client-15`)
- `bun` or `node` 20+
- `curl`

## Requirements (server)

- `psql` (already inside the Supabase Postgres container — use `docker exec`)
- Coolify with Supabase stack already running