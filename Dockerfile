# syntax=docker/dockerfile:1.7

# ============================================================
# Stage 1: Build (Bun + Vite)
# ============================================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Build-time args — Vite inlines VITE_* into the client bundle.
# Coolify passes these via "Build Variable" entries.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_PROJECT_ID=self-hosted
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID

# Install deps first to leverage Docker layer cache
COPY package.json bun.lock* bunfig.toml ./
RUN bun install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Target Node server (not Cloudflare Workers) for self-hosted deployment.
# vite.config.docker.ts sets `nitro: { preset: "node-server" }` explicitly —
# without that, @lovable.dev/vite-tanstack-config skips Nitro outside the
# Lovable sandbox and no SSR server bundle is produced.
ENV NODE_ENV=production

RUN bun run vite build -c vite.config.docker.ts

# ============================================================
# Stage 2: Runtime (Node 20, minimal)
# ============================================================
FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Nitro's node-server preset writes a self-contained bundle to .output/
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", "/app/.output/server/index.mjs"]
