# syntax=docker/dockerfile:1.7

# ============================================================
# Stage 1: Build (Bun + Vite)
# ============================================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Install deps first to leverage Docker layer cache
COPY package.json bun.lock* bunfig.toml ./
RUN bun install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Target Node server (not Cloudflare Workers) for self-hosted deployment.
# Nitro reads NITRO_PRESET automatically; vite.config.docker.ts skips the
# Workers-specific server entry override so the default Node HTTP listener
# is bundled instead.
ENV NITRO_PRESET=node_server
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

# Nitro's node_server preset writes a self-contained bundle to .output/
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Healthcheck — Coolify also runs its own, this is a fallback
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

CMD ["node", ".output/server/index.mjs"]
