<img src="logo/header.svg" alt="TimeBill" />

A lightweight, privacy-first time tracking PWA for freelancers and consultants. Track hours across clients and projects, visualize your day, generate invoices, and monitor monthly budgets — all in the browser with no server required.

---

## Features

- **Live timers** — run multiple timers simultaneously, restart past entries with one click
- **Day timeline** — proportional visualization of your time blocks across each day
- **Cost tracking** — per-project hourly rates compute earnings in real time
- **Monthly budgets** — progress bars warn at 80% and 100% of hour budgets
- **Invoicing** — printable per-client invoices with automatic entry archival
- **Reports** — daily bar chart, project and client breakdowns, CSV export
- **Works offline** — installable PWA backed entirely by localStorage; no account needed

## Stack

| Layer | Choice |
|---|---|
| UI | Svelte 5 + Vite |
| Styling | Tailwind CSS 3 |
| State | svelte-persisted-store (localStorage) |
| Charts | Chart.js 4 |
| Icons | lucide-svelte |
| PWA | vite-plugin-pwa |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5274](http://localhost:5274).

```bash
npm run build   # production build → dist/
npm run preview # preview the production build locally
```

## Data Model

All data lives in `localStorage` under four keys:

| Key | Contents |
|---|---|
| `tb_clients` | Client name + color swatch |
| `tb_projects` | Project name, hourly rate, monthly hour budget |
| `tb_entries` | Completed time entries with start/stop timestamps |
| `tb_active_timers` | In-progress timers (elapsed computed from `startedAt`) |

## Project Structure

```
src/
├── components/
│   ├── layout/        AppShell, NavBar, Drawer
│   ├── timer/         TimerCard, TimerList, DayTimeline, RecentEntryRow
│   ├── reports/       Charts, breakdowns, invoice modal, CSV export
│   └── settings/      Client and project CRUD forms
├── store/
│   ├── index.js       Persisted + ephemeral Svelte stores
│   ├── actions.js     startTimer, stopTimer, CRUD, archival
│   └── derived.js     Computed daily/project/client totals
└── utils/
    ├── time.js        Duration and date formatting
    ├── money.js       Cost computation and currency formatting
    └── colors.js      Shared client color map
```

## License

MIT
