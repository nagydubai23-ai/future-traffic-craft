// Docker-build variant of vite.config.ts.
//
// The default vite.config.ts overrides TanStack Start's server entry to
// src/server.ts, which exports a Cloudflare-Workers-style
// `export default { fetch }` handler. That entry shape does not work with
// Nitro's `node_server` preset — the Node listener expects the default
// server-entry exported by @tanstack/react-start.
//
// For self-hosted (Hetzner / Coolify) deployments we build with this
// config: no entry override, NITRO_PRESET=node_server set by Dockerfile.
// Output is a self-contained Node bundle in .output/ runnable with
// `node .output/server/index.mjs`.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Force-enable Nitro outside the Lovable sandbox and target a standalone
  // Node server bundle at .output/server/index.mjs.
  nitro: { preset: "node-server" },
});