# syntax=docker/dockerfile:1.7
#
# TimeBill = one PocketBase binary that serves both /api/* (REST/realtime)
# and / (the SvelteKit SPA built into pb_public). The only stateful path
# is /app/pb_data — mount it as a volume to keep your SQLite DB and
# uploaded receipts across container restarts and image upgrades.
#
# Multi-arch image. Build with:
#   docker buildx build --platform linux/amd64,linux/arm64 -t timebill ..
# or just let `docker compose up --build` build for the current host.

# ─── Stage 1: build the SvelteKit static SPA ────────────────────────────
# Run on $BUILDPLATFORM (the machine doing the build) — Node + Vite work
# the same regardless of the target arch, so this avoids a slow QEMU
# emulation pass when cross-building.
FROM --platform=$BUILDPLATFORM node:20-alpine AS web
WORKDIR /src

# Cache npm install separately from source changes.
COPY package.json package-lock.json* ./
COPY apps/web/package.json apps/web/
COPY apps/desktop/package.json apps/desktop/
COPY packages/shared/package.json packages/shared/
RUN npm ci --include=dev

# Bring in the rest and build the web app. The output lands at
# apps/web/build/ per svelte.config.js (adapter-static + fallback).
COPY . .
RUN npm run build:web


# ─── Stage 2: minimal runtime ───────────────────────────────────────────
FROM alpine:3.20
ARG TARGETARCH
ARG PB_VERSION=0.39.7

# Pinned PocketBase release. Update PB_VERSION when you bump the local
# binary; migrations are version-tolerant but staying in lockstep keeps
# surprises off the menu.
RUN apk add --no-cache ca-certificates wget && \
    apk add --no-cache --virtual .build-deps unzip curl && \
    case "$TARGETARCH" in \
      amd64) PB_ARCH=amd64 ;; \
      arm64) PB_ARCH=arm64 ;; \
      *) echo "Unsupported arch: $TARGETARCH" >&2; exit 1 ;; \
    esac && \
    curl -fsSL "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${PB_ARCH}.zip" -o /tmp/pb.zip && \
    mkdir -p /app && \
    unzip /tmp/pb.zip -d /app pocketbase && \
    chmod +x /app/pocketbase && \
    rm /tmp/pb.zip && \
    apk del .build-deps

WORKDIR /app

# Server-side JS hooks + collection definitions — both version-controlled
# in the repo. New migrations run on container start; new hook files take
# effect on the next request (PB watches the dir).
COPY pocketbase/pb_migrations/ /app/pb_migrations/
COPY pocketbase/pb_hooks/ /app/pb_hooks/

# The SPA built in stage 1 becomes PocketBase's static-file root.
COPY --from=web /src/apps/web/build/ /app/pb_public/

EXPOSE 8090

# Declare the data dir as a volume so callers know to mount it. Compose
# wires it to a named volume; `docker run -v` works too.
VOLUME ["/app/pb_data"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8090/api/health || exit 1

# Bind to 0.0.0.0 so the container's port is reachable on your LAN
# (compose maps it to the host's :8090 by default).
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]
