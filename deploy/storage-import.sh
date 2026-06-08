#!/usr/bin/env bash
# Upload every file from deploy/storage/cms-images/ into the new self-hosted
# Supabase `cms-images` bucket. Run from the HETZNER server.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export SRC_DIR="${SCRIPT_DIR}/storage/cms-images"

if [[ ! -d "${SRC_DIR}" ]]; then
  echo "ERROR: ${SRC_DIR} not found. Run storage-export.sh first."
  exit 1
fi

: "${SUPABASE_URL:?must be set to the NEW self-hosted Supabase URL}"
: "${SUPABASE_SERVICE_ROLE_KEY:?must be set}"

RUNNER="$(command -v bun || command -v node)"
exec "${RUNNER}" "${SCRIPT_DIR}/storage-import.mjs"