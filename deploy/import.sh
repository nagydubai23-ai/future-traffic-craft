#!/usr/bin/env bash
# Restore schema + data into the self-hosted Supabase Postgres on this server.
# Run from the HETZNER server, inside the directory containing dump/.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DUMP_DIR="${SCRIPT_DIR}/dump"

: "${POSTGRES_CONTAINER:?POSTGRES_CONTAINER must be set (find via: docker ps | grep supabase-db)}"
: "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD must be set (from Coolify Supabase service)}"

psql_in_container() {
  docker exec -i -e PGPASSWORD="${POSTGRES_PASSWORD}" "${POSTGRES_CONTAINER}" \
    psql -U postgres -d postgres "$@"
}

echo "==> Restoring public schema (DDL)…"
psql_in_container < "${DUMP_DIR}/schema.sql"

if [[ -s "${DUMP_DIR}/auth_users.sql" ]]; then
  echo "==> Restoring auth.users…"
  psql_in_container < "${DUMP_DIR}/auth_users.sql"
else
  echo "==> Skipping auth.users (no dump found)"
fi

echo "==> Restoring public schema (data)…"
psql_in_container < "${DUMP_DIR}/data.sql"

echo
echo "Done. Next: run storage-import.sh to upload files."