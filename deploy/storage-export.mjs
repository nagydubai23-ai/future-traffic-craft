// Walks the `cms-images` bucket recursively via Supabase Storage REST API
// and downloads every object to OUT_DIR, preserving relative paths.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OUT_DIR = process.env.OUT_DIR;
const BUCKET = "cms-images";

if (!SUPABASE_URL || !KEY || !OUT_DIR) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / OUT_DIR");
  process.exit(1);
}

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

async function listFolder(prefix) {
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        prefix,
        limit: 1000,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      }),
    },
  );
  if (!res.ok) throw new Error(`list ${prefix}: ${res.status} ${await res.text()}`);
  return res.json();
}

async function downloadObject(path) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`download ${path}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const dest = join(OUT_DIR, path);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  console.log(`  ok ${path} (${buf.length} bytes)`);
}

async function walk(prefix = "") {
  const entries = await listFolder(prefix);
  for (const e of entries) {
    const fullPath = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.id === null) {
      await walk(fullPath);
    } else {
      await downloadObject(fullPath);
    }
  }
}

console.log(`==> Downloading bucket "${BUCKET}" -> ${OUT_DIR}`);
await walk("");
console.log("Done.");