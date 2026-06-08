// Walks deploy/storage/cms-images/ and uploads each file to the new
// self-hosted Supabase `cms-images` bucket. Creates the bucket if missing.
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SRC_DIR = process.env.SRC_DIR;
const BUCKET = "cms-images";

if (!SUPABASE_URL || !KEY || !SRC_DIR) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / SRC_DIR");
  process.exit(1);
}

const baseHeaders = { apikey: KEY, Authorization: `Bearer ${KEY}` };

async function ensureBucket() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${BUCKET}`, {
    headers: baseHeaders,
  });
  if (res.ok) return;
  console.log(`==> Creating bucket "${BUCKET}"`);
  const create = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: { ...baseHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false }),
  });
  if (!create.ok) throw new Error(`bucket create: ${create.status} ${await create.text()}`);
}

function guessContentType(name) {
  const ext = name.toLowerCase().split(".").pop();
  return (
    {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
      gif: "image/gif",
      svg: "image/svg+xml",
      avif: "image/avif",
    }[ext] || "application/octet-stream"
  );
}

async function uploadFile(absPath, relPath) {
  const body = await readFile(absPath);
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${relPath}`,
    {
      method: "POST",
      headers: {
        ...baseHeaders,
        "Content-Type": guessContentType(relPath),
        "x-upsert": "true",
      },
      body,
    },
  );
  if (!res.ok) throw new Error(`upload ${relPath}: ${res.status} ${await res.text()}`);
  console.log(`  ok ${relPath} (${body.length} bytes)`);
}

async function walk(dir) {
  for (const entry of await readdir(dir)) {
    const full = join(dir, entry);
    const s = await stat(full);
    if (s.isDirectory()) {
      await walk(full);
    } else {
      const rel = relative(SRC_DIR, full).split("\\").join("/");
      await uploadFile(full, rel);
    }
  }
}

await ensureBucket();
console.log(`==> Uploading ${SRC_DIR} -> bucket "${BUCKET}"`);
await walk(SRC_DIR);
console.log("Done.");