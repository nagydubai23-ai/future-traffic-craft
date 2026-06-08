#!/usr/bin/env bash
# Download every file from the `cms-images` storage bucket on Lovable Cloud.
# Files are saved under deploy/storage/cms-images/ preserving their paths.
#
# Prerequisites:
#   - SUPABASE_URL                Lovable Cloud project URL
#   - SUPABASE_SERVICE_ROLE_KEY   Service-role key
#   - bun or node 20+

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export OUT_DIR="${SCRIPT_DIR}/storage/cms-images"
mkdir -p "${OUT_DIR}"

if [[ -z "${SUPABASE_URL:-}" || -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
  echo "ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
  exit 1
fi

RUNNER="$(command -v bun || command -v node)"
if [[ -z "${RUNNER}" ]]; then
  echo "ERROR: bun or node 20+ required."
  exit 1
fi

exec "${RUNNER}" "${SCRIPT_DIR}/storage-export.mjs"