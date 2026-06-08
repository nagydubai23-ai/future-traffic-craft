#!/usr/bin/env bash
# Dump the public schema + auth.users from Lovable Cloud Postgres.
# Run from your LOCAL machine.
#
# Prerequisites:
#   1. Set SUPABASE_DB_URL to the connection string from Lovable Cloud:
#        Cloud → Project Settings → Database → Connection string (URI)
#   2. Have pg_dump 15+ installed locally.
#
# Output: deploy/dump/{schema,data,auth_users}.sql

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="${SCRIPT_DIR}/dump"
mkdir -p "${OUT_DIR}"

if [[ -z "${SUPABASE_DB_URL:-}" ]]; then
  echo "ERROR: SUPABASE_DB_URL is not set."
  echo "Get it from Lovable Cloud → Database → Connection string."
  exit 1
fi

echo "==> Dumping public schema (DDL only)…"
pg_dump "${SUPABASE_DB_URL}" \
  --schema=public \
  --schema-only \
  --no-owner --no-privileges \
  --no-comments \
  > "${OUT_DIR}/schema.sql"

echo "==> Dumping public schema (data only)…"
pg_dump "${SUPABASE_DB_URL}" \
  --schema=public \
  --data-only \
  --no-owner --no-privileges \
  --disable-triggers \
  --column-inserts \
  > "${OUT_DIR}/data.sql"

echo "==> Dumping auth.users (data only — preserves UUIDs)…"
pg_dump "${SUPABASE_DB_URL}" \
  --table=auth.users \
  --table=auth.identities \
  --data-only \
  --no-owner --no-privileges \
  --column-inserts \
  > "${OUT_DIR}/auth_users.sql" || {
    echo "  (skipping auth dump — service-role access may be required)"
  }

echo
echo "Done. Files written to ${OUT_DIR}/"
ls -lh "${OUT_DIR}/"