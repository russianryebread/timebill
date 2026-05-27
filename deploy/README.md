# Deploying TimeBill on your LAN with Docker

One container. One volume. The container runs PocketBase, which serves
both the JSON/REST/realtime API at `/api/*` and the SvelteKit SPA at
`/`. All persistent state — SQLite DB, uploaded receipts, generated
invoice PDFs — lives in a single mounted volume.

## First run

```sh
cd deploy
docker compose up -d --build
```

The image builds the SvelteKit SPA inside stage 1 and downloads its own
PocketBase binary inside stage 2 — no need to pre-build anything on the
host.

Then in a browser:

- `http://<lan-host>:8090/`   → the TimeBill web app
- `http://<lan-host>:8090/_/` → the PocketBase admin UI (create your
  superuser on first visit; this is **not** the same as your TimeBill
  workspace login)

`<lan-host>` is the IP or hostname of the machine running Docker —
e.g. `http://192.168.1.50:8090` or `http://nas.local:8090`.

## Point the Mac desktop app at your LAN server

The Tauri build defaults to `http://127.0.0.1:8090`. To switch it to
your LAN box, open the menubar popover, hit *Open app*, then in any
page open the DevTools console (right-click → Inspect in dev builds,
or temporarily run the Mac app from `npm run dev:desktop`) and:

```js
localStorage.setItem('pb_url', 'http://192.168.1.50:8090')
```

Reload the window. The override persists per install. There's a
follow-up plan item to surface this as a Settings panel field; for now
the localStorage poke is the one-liner.

## Updating

```sh
cd deploy
git pull            # pull the latest TimeBill changes
docker compose up -d --build
```

New migrations under `pocketbase/pb_migrations/` replay automatically
on container start. Your data in the `pb_data` volume survives the
rebuild.

## Backups

The whole world is in one volume. Snapshot it on whatever cadence you
care about:

```sh
# Quick manual snapshot to ./backups/
mkdir -p ./backups
docker run --rm \
  -v deploy_pb_data:/data:ro \
  -v "$(pwd)/backups":/backup \
  alpine \
  tar czf "/backup/timebill-$(date +%F-%H%M).tar.gz" -C /data .
```

(Volume name is `deploy_pb_data` because Docker prefixes named volumes
with the compose project name, which defaults to the directory name —
`deploy/` in this repo. Verify with `docker volume ls`.)

To restore, stop the container, wipe the volume, untar back in:

```sh
docker compose down
docker volume rm deploy_pb_data
docker volume create deploy_pb_data
docker run --rm \
  -v deploy_pb_data:/data \
  -v "$(pwd)/backups":/backup \
  alpine \
  sh -c "cd /data && tar xzf /backup/timebill-<TIMESTAMP>.tar.gz"
docker compose up -d
```

For continuous replication, drop in a [Litestream](https://litestream.io)
sidecar pointed at `/app/pb_data/data.db` → S3 / Backblaze B2 / R2.

## Multi-arch image (build once, run anywhere on your LAN)

`docker compose build` builds for the current host's arch only. If you
want the same image to run on, say, an x86_64 NAS *and* a Raspberry Pi,
build with buildx:

```sh
docker buildx create --name timebill-builder --use   # one-time
cd ..   # build context is the repo root
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --file deploy/Dockerfile \
  --tag timebill:latest \
  --load .
```

(`--load` only works for single-platform; for multi-platform push to a
registry or use `--output type=oci,dest=timebill.tar`.)

## Email (optional but recommended)

Without SMTP, "Send to client" invoices and password-reset emails log
to the container's stderr instead of delivering. Configure SMTP via the
PocketBase admin UI at `/_/` → Settings → Mail. Per-workspace `From`
overrides live under TimeBill's own Settings → Email tab.

## HTTPS (optional, only matters off-LAN)

For LAN-only access HTTP is fine. If you decide to expose this to the
internet, terminate TLS upstream (Caddy / nginx / Traefik / Cloudflare
Tunnel) and proxy to the container's port 8090. The app itself does
not need to know about TLS.
