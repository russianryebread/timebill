# TimeBill — Plan

## Context

A unified billing/tracking app for hourly contractors that handles **time tracking, expenses, invoicing, payment tracking, and tax estimation** in one place. Today these workflows are split across Toggl + a spreadsheet + QuickBooks + a PDF generator, and reconciling them at tax time is painful. TimeBill makes the contractor's whole money-in/money-out picture queryable from one data model.

**v1 ships as a single-user, cloud-synced app** (web + Mac desktop), but the schema and access rules are designed from day one to extend cleanly into **teams**, a **mobile companion**, and **AI features** without a rewrite.

### Decisions locked in

| Area | Choice |
| --- | --- |
| Clients | SvelteKit web app + Tauri Mac desktop app (shared Svelte components) |
| Backend | PocketBase (Go binary, SQLite, auth/realtime/files built in); JS hooks for server-side logic. **Also serves the SvelteKit static build from `pb_public/`** — one binary, one origin. |
| Dev tooling | Node 20+ (or Bun — interchangeable) for SvelteKit build. No JS runtime required in production; PocketBase runs server-side JS in its embedded Goja engine. |
| Auth | PocketBase email/password; single-user but schema is multi-tenant-ready |
| Currency | USD only |
| Tax scope | US quarterly self-employment estimate helper + Schedule C category CSV export |
| Integrations | None in v1 (manual entry); design data model so Stripe/Plaid/QBO drop in later |
| Time entry | Live start/stop timer + Mac menu bar timer |
| Expenses | Manual entry + receipt upload + mileage + recurring |
| Invoicing | PDF + email + public client view link + recurring/retainer + per-client/project rates |
| AI | Not in v1, but leave room (e.g., description embeddings table stub, deterministic core logic) |

### Open items
- Menu bar UI: a screenshot mockup was mentioned but not attached. Plan specifies a sensible default (quick-pick recent projects + running timer + today's hours); we'll match the screenshot once shared.

---

## Architecture

### Component layout

```
                ┌─────────────────────┐
                │    Browser (web)    │  ─┐
                └─────────────────────┘   │
                ┌─────────────────────┐   │  Same SvelteKit static build,
                │  Tauri Mac app      │  ─┤  loaded from PocketBase or bundled
                └─────────────────────┘   │
                                          │
                                ┌─────────▼──────────┐
                                │     PocketBase     │
                                │  - SQLite DB       │
                                │  - Auth            │
                                │  - File storage    │
                                │  - JS hooks (Goja) │
                                │  - Scheduled jobs  │
                                │  - Static server   │ ← serves the web app from pb_public/
                                └────────────────────┘
```

- **SvelteKit** built with `@sveltejs/adapter-static` to produce a pure static SPA. Output is copied into PocketBase's `pb_public/` directory so PocketBase serves the web app directly. No SSR — PocketBase is the auth/data source via its REST + realtime API.
- **PocketBase** is a single Go binary handling: API, SQLite, auth, file storage (receipts, invoice PDFs, logos), JS hooks (`pb_hooks/`), and static file serving for the web app. **No separate web host needed.** One process, one origin → no CORS configuration either.
- **Tauri** wraps the same Svelte build for the Mac app and adds native capabilities the web app can't have: menu bar timer, system notifications, global hotkeys, and menu bar icon state. The Mac app can either bundle the static assets locally (offline-capable shell) or point at the deployed PocketBase URL — we'll bundle locally and configure the PB base URL at runtime so the desktop app can connect to your PocketBase instance.
- **Build tooling:** Node or Bun (interchangeable) for `svelte-kit build` and Tauri's bundler. No JS runtime required in production — Goja runs server-side hooks inside PocketBase.

### Hosting

- **PocketBase + web app: one host.** A small VPS (Fly.io, Hetzner, or Railway) running the PocketBase binary. It serves the API at `/api/*` and the SvelteKit static build from `/`. Persistent volume for SQLite + uploaded files. Backups via Litestream to S3-compatible storage.
- TLS via a reverse proxy (Caddy with auto-Let's-Encrypt is the simplest) or the platform's built-in TLS termination.
- **Mac app:** signed/notarized `.dmg` distributed via GitHub Releases with Tauri's updater for auto-update. Static assets bundled in the app; PocketBase URL configurable in app settings.

### Repo layout

```
TimeBill/
├── apps/
│   ├── web/                 # SvelteKit app (the shared client UI). `build/` is copied into pocketbase/pb_public/
│   └── desktop/             # Tauri shell that bundles apps/web's build
├── packages/
│   ├── shared/              # Types, Zod schemas, pure logic (tax calc, invoice math, money formatting)
│   └── ui/                  # Reusable Svelte components used by both apps
├── pocketbase/
│   ├── pb_public/           # Web app static build lives here (gitignored; populated by `npm run build`)
│   ├── pb_migrations/       # Collection definitions as migrations (version-controlled)
│   ├── pb_hooks/            # JS hooks: invoice number generation, recurring invoices, tax calcs
│   └── pocketbase           # Binary (gitignored; pinned version in README)
└── package.json             # workspaces (npm or bun — works with either)
```

---

## Data model (PocketBase collections)

Every business collection gets a `workspace` relation field. v1 auto-creates one workspace per user; v2 lets a workspace have many `workspace_members`. This single field is what makes the "design for teams" goal cheap.

### Core collections

| Collection | Key fields | Notes |
| --- | --- | --- |
| `workspaces` | `name`, `owner` (rel → users), `default_currency` (USD), `tax_profile_json` | One per user in v1. |
| `workspace_members` *(v2 stub, define now)* | `workspace`, `user`, `role` (owner/admin/member) | Rules already check this collection so adding members later is zero-migration. |
| `clients` | `workspace`, `name`, `email`, `address`, `default_rate_cents`, `notes`, `archived` | |
| `projects` | `workspace`, `client`, `name`, `rate_cents` (nullable → fallback to client/task rate), `status`, `budget_hours`, `color` | |
| `tasks` | `workspace`, `name`, `rate_cents` (nullable), `billable_default` (bool) | E.g., "Development", "Meetings". Used for per-task rates. |
| `time_entries` | `workspace`, `project`, `task`, `started_at`, `ended_at` (nullable while running), `description`, `billable`, `rate_cents_snapshot`, `invoice` (nullable rel) | A running timer = `ended_at IS NULL`. Rate snapshotted at stop time so changing rates later doesn't rewrite history. |
| `expense_categories` | `workspace`, `name`, `schedule_c_line` (string, e.g. "Line 22: Supplies") | Seeded with standard Schedule C lines on workspace create. |
| `expenses` | `workspace`, `category`, `date`, `amount_cents`, `vendor`, `description`, `client` (nullable, for billable expenses), `project` (nullable), `billable` (bool), `reimbursable` (bool), `receipt` (file), `invoice` (nullable rel) | |
| `mileage_entries` | `workspace`, `date`, `miles`, `purpose`, `client` (nullable), `project` (nullable), `billable`, `rate_cents_snapshot` | Auto-populates rate from current IRS standard mileage rate stored in a `tax_settings` singleton. |
| `recurring_expenses` | `workspace`, `category`, `amount_cents`, `vendor`, `cadence` (monthly/yearly), `next_run`, `active` | A scheduled JS hook materializes due ones into `expenses` daily. |
| `invoices` | `workspace`, `client`, `number` (per-workspace sequence), `issue_date`, `due_date`, `status` (draft/sent/viewed/paid/overdue/void), `subtotal_cents`, `tax_cents`, `total_cents`, `notes`, `public_token` (UUID for client portal link), `pdf` (file) | |
| `invoice_line_items` | `invoice`, `description`, `quantity` (decimal — hours or units), `unit_price_cents`, `amount_cents`, `source` (time_entry/expense/mileage/manual), `source_id` (string) | |
| `recurring_invoices` | `workspace`, `client`, `template_line_items_json`, `cadence`, `next_run`, `active`, `auto_send` (bool) | Scheduled hook generates invoice + optionally emails. |
| `payments` | `workspace`, `invoice`, `date`, `amount_cents`, `method` (check/ACH/cash/card/other), `reference`, `notes` | Multiple payments per invoice supported (partial pay). |
| `tax_settings` | `workspace`, `filing_status`, `state`, `estimated_other_income_cents`, `mileage_rate_cents_per_mile`, `quarterly_safe_harbor_pct` | Singleton per workspace. |
| `events_outbox` *(AI/integrations stub)* | `workspace`, `kind`, `payload_json`, `processed_at` | Empty in v1, populated later by hooks. |

### Access rules pattern (PocketBase)

For every business collection:
```
listRule:   @request.auth.id != "" && workspace.members_can_read = true
                                    // expands to: caller is workspace owner OR a member
viewRule:   same
createRule: caller belongs to workspace
updateRule: same
deleteRule: same (with role check for sensitive ones)
```

Encode this as a helper expression referencing `workspace_members`. In v1 the owner is the only member; in v2 the same rules just start matching more rows. **No rule rewrites needed when teams ship.**

Public invoice view bypasses auth via a dedicated unauthenticated endpoint in `pb_hooks/` that takes `public_token` and returns the rendered invoice JSON.

---

## Feature design

### Time tracking
- **Live timer:** one running entry per user at a time (enforced by a hook). Starting a new one auto-stops the current one. The timer survives reload/restart because it lives in PocketBase, not local state.
- **Quick-pick:** menu bar dropdown shows last 5 project+task combos + a search box. One click starts a timer.
- **Edit history:** entries can be edited inline (start/end/description). Rate snapshot is preserved on edit unless explicitly recalculated.
- **Idle detection (desktop only):** Tauri watches system idle; if user has been idle >5 min while a timer runs, surface a "discard idle time / keep / split" prompt on return.
- **Calendar import (post-v1, schema-ready):** `time_entries` already accepts arbitrary `started_at`/`ended_at` so importing is a UI feature, not a schema change.

### Mac menu bar timer (Tauri)
- Menu bar icon shows clock symbol; turns colored when a timer runs.
- Dropdown (default spec — to be reconciled with your screenshot):
  - Top: current running timer (project · task · elapsed) + Stop button
  - Middle: quick-pick recent project/task list with search
  - Bottom: today's billable total + "Open app" link
- Global hotkey: ⌃⌥T to start/stop the most recent timer.

### Expenses
- Form: date / vendor / category / amount / billable + client/project / receipt upload / notes.
- Receipt upload uses PocketBase file fields — no S3 needed in v1.
- **Mileage entry:** separate quick form (date / miles / purpose / billable). Rate auto-pulled from `tax_settings`.
- **Recurring expenses:** a PocketBase scheduled hook (`pb_hooks/cron_recurring.js`) runs daily, materializes any `recurring_expenses` whose `next_run <= today` into `expenses`, and advances `next_run`.

### Invoicing
- **Draft → send → paid flow:** invoice starts as `draft`; user pulls in unbilled time entries / expenses / mileage from a side panel (auto-grouped by date or project). Each pulled item gets linked via `time_entries.invoice` / `expenses.invoice` / `mileage_entries.invoice` so it can't be double-billed.
- **PDF generation:** server-side hook generates a PDF on send. Use `@react-pdf/renderer`-equivalent for Svelte (e.g., `pdfmake` or `puppeteer-core` in a hook), stored in `invoices.pdf`. Pin the choice during build.
- **Email send:** PocketBase has built-in SMTP — configure with a transactional provider (Resend, Postmark, or SES). One template for "invoice sent" with a public view link.
- **Public client portal:** unauthenticated route `/i/:public_token` renders a read-only invoice page (no client login). v1 just shows the invoice; v2 adds a "Pay" button when Stripe is wired in.
- **Recurring/retainer:** `recurring_invoices` cron generates the next invoice from a template, optionally auto-sends. Useful for retainer clients.
- **Rate resolution order** (when adding a time entry to an invoice line):
  1. `time_entries.rate_cents_snapshot` if set
  2. else `task.rate_cents`
  3. else `project.rate_cents`
  4. else `client.default_rate_cents`
- **Invoice numbering:** per-workspace sequence in a hook; format configurable (`INV-{year}-{seq:04d}` default).

### Payment tracking
- `payments` collection allows multiple partial payments per invoice. Invoice `status` is derived: when `SUM(payments.amount_cents) >= total_cents` → `paid`; else if past `due_date` → `overdue`; else stays `sent` or `viewed`.
- A nightly hook updates `overdue` status.
- "Viewed" status is set the first time the public token URL is hit.

### Tax tracking
- **Schedule C category mapping:** every expense has a category, every category maps to a Schedule C line. The "Tax" view aggregates YTD by line.
- **Mileage deduction:** total miles × IRS standard rate (configurable; defaults to current-year rate, stored in `tax_settings`).
- **Quarterly estimate helper:**
  - Pure functions in `packages/shared/tax.ts`, easy to unit-test.
  - Inputs: YTD net SE income, filing status, state (flat-rate approximation only for v1), prior-year safe-harbor target.
  - Outputs: estimated SE tax (15.3% on 92.35% of net earnings, with SS wage-base cap), estimated federal income tax (bracket calc), suggested quarterly payment for the current quarter, "safe harbor" check.
  - Big banner: this is an estimate, not advice. Link to IRS Form 1040-ES.
- **CSV exports:** by year — `time_entries.csv`, `expenses.csv` (with Schedule C line), `mileage.csv`, `invoices.csv`, `payments.csv`. Drop into any accountant's workflow.

### Reporting (v1 dashboard)
- Today: hours logged, billable $, running timer
- This week / month: hours, billable $, expenses, net
- Outstanding A/R: total owed, oldest invoice, count overdue
- YTD: net SE income, est. quarterly payment due, deductible expense total

---

## Designing for the future (cheap hooks, not features)

These cost nothing now but save a rewrite later:
- **Teams:** `workspace_members` exists and access rules already check it. Adding teams = build invite UI + role enforcement, no schema migration.
- **Mobile:** PocketBase JS SDK works in React Native; the shared logic in `packages/shared/` is platform-agnostic. The whole API is the contract.
- **AI:** `events_outbox` table is in place. When AI ships, hooks fan out create/update events; an external worker (or `pb_hooks/`) can embed descriptions, categorize expenses, suggest invoice line text, etc. Description fields are already free-text. No data model changes.
- **Integrations (Stripe/Plaid/QBO):** `payments.method` and `payments.reference` already accommodate external IDs. Invoice `public_token` is the foundation for a Stripe "pay invoice" button.

---

## Build phases

| Phase | Scope | Why this order |
| --- | --- | --- |
| **0. Foundation** | Monorepo (Bun workspaces), SvelteKit app skeleton, Tauri shell, PocketBase binary + migrations runner, auth flow, `workspaces` auto-create on signup. | Nothing works without this. |
| **1. Time tracking** | Clients, projects, tasks, time entries, live timer, manual entries, Mac menu bar timer + global hotkey. | Highest-frequency workflow; drives invoice data. |
| **2. Expenses** | Expense categories (seeded), expenses + receipt upload, mileage entries, recurring expenses cron. | Needed before invoicing (billable expenses) and tax. |
| **3. Invoicing** | Invoice draft/send/paid flow, pull unbilled items, PDF generation, public view link, email send via SMTP. | The payoff feature for time + expense data. |
| **4. Payments** | Payments collection, partial payments, status derivation, overdue cron. | Closes the money loop. |
| **5. Tax & reporting** | Schedule C aggregation, quarterly estimate calculator, dashboard, CSV exports. | Year-end + quarterly use case. |
| **6. Recurring invoices** | Template + cadence + auto-send cron. | Nice-to-have built on the solid invoice foundation. |

---

## Verification

End-to-end smoke test (run after each phase, full pass before any "v1 done" claim):

1. **Auth & workspace.** Sign up → workspace auto-created → log out / log in works on both web and Mac.
2. **Time tracking.** Create client + project. Start timer from menu bar → close laptop → reopen → timer still running. Stop. Edit entry. Hours total matches dashboard.
3. **Expenses.** Add expense with receipt photo. Add mileage entry. Add recurring expense; manually trigger cron hook and verify materialization. Verify Schedule C totals update.
4. **Invoicing.** Create invoice. Pull unbilled time + a billable expense + mileage. Verify rate resolution picks the right rate per the order above. Send invoice → PDF generated, email received, public link opens without auth, `status` flips to `viewed`.
5. **Payment.** Record partial payment → status stays `sent`. Record remainder → status flips to `paid`. Wait past `due_date` on a different invoice → overdue cron flips status.
6. **Tax.** Open quarterly estimate view → totals match expected sums from steps 2–5. Export each CSV; open in Numbers/Excel; verify Schedule C lines are populated.
7. **Cross-client sync.** Make a change on web → see it appear on Mac app within 1s (PocketBase realtime).
8. **Unit tests.** `packages/shared/tax.ts` has tests for SE tax math (boundary: SS wage base, married filing jointly vs. single, edge case zero income) and invoice math (multiple rate fallbacks, billable expense passthrough). `bun test` is green.
9. **Tauri build.** `bun run tauri build` produces a signed `.dmg` that launches and connects to the same PocketBase backend as web.

---

## Critical files to create (representative, not exhaustive)

- `package.json` — Bun workspaces root
- `apps/web/svelte.config.js` — SvelteKit, static adapter
- `apps/web/src/lib/pb.ts` — PocketBase client singleton + auth store
- `apps/web/src/lib/timer.svelte.ts` — running-timer store with PB realtime subscription
- `apps/desktop/src-tauri/tauri.conf.json` — Tauri config (menu bar, tray icon, global shortcut, updater)
- `apps/desktop/src-tauri/src/menubar.rs` — menu bar timer (Rust side, calls into web via Tauri events)
- `packages/shared/src/tax.ts` — pure tax math (most-tested file in the repo)
- `packages/shared/src/invoice.ts` — line-item generation, rate resolution, totals
- `packages/shared/src/schemas.ts` — Zod schemas mirroring PB collections
- `pocketbase/pb_migrations/0001_init.js` — all collections + indexes + rules
- `pocketbase/pb_migrations/0002_seed_schedule_c_categories.js` — seed defaults on workspace create (via hook)
- `pocketbase/pb_hooks/timer.pb.js` — single-running-timer enforcement, rate snapshot on stop
- `pocketbase/pb_hooks/invoice.pb.js` — number sequence, status derivation, public token routes
- `pocketbase/pb_hooks/cron.pb.js` — daily jobs (recurring expenses, recurring invoices, overdue check)
- `pocketbase/pb_hooks/email.pb.js` — invoice send template
