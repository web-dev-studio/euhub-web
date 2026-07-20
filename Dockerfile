# ===========================================================================
# Build with EUHub — Dockerfile for GCP Cloud Run
# Multi-stage build: Bun + Node for build, Node slim for runtime.
# ===========================================================================

# --- Stage 1: Build ---
FROM oven/bun:1.3 AS builder

# Node is needed as the Astro runtime (Bun's runtime doesn't support
# module.registerHooks which Astro 7 requires)
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy lockfile + package.json first for cache
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build (using Node as the runtime, Bun as the package manager)
RUN npx astro build

# --- Stage 2: Production dependencies only ---
# Resolved with bun + --frozen-lockfile so the runtime image gets exactly
# what bun.lock pins — npm cannot read bun.lock and would otherwise
# re-resolve from package.json's semver ranges with no lockfile at all.
FROM oven/bun:1.3 AS prod-deps

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# --- Stage 3: Runtime ---
FROM node:22-slim

WORKDIR /app

# Copy built output + the bun-resolved, lockfile-pinned production deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=prod-deps /app/node_modules ./node_modules
COPY server.mjs ./server.mjs

# Cloud Run provides PORT env var (default 8080)
ENV HOST=0.0.0.0
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# server.mjs wraps the @astrojs/node standalone handler with a
# legacy-host 301 (web-dev-studio.com -> build.euhub-ai.com) that fires
# before static-file serving — see server.mjs for why.
CMD ["node", "server.mjs"]
