<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '$lib/pb';
  import { workspace } from '$lib/workspace.svelte';
  import { parseHarvestCsv, buildPreview, type HarvestRow, type ImportPreview } from '$lib/harvest';
  import { formatUSD, formatHours } from '@timebill/shared/money';

  type Stage = 'idle' | 'parsing' | 'preview' | 'importing' | 'done';

  let stage = $state<Stage>('idle');
  let parseErrors = $state<{ line: number; reason: string }[]>([]);
  let rows = $state<HarvestRow[]>([]);
  let preview = $state<ImportPreview | null>(null);
  let progress = $state('');
  let result = $state<{ clients: number; projects: number; tasks: number; entries: number } | null>(null);

  async function onFile(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    stage = 'parsing';
    parseErrors = [];
    const text = await file.text();
    const parsed = parseHarvestCsv(text);
    parseErrors = parsed.errors;
    rows = parsed.rows;
    if (rows.length === 0) {
      stage = 'idle';
      return;
    }
    // Snapshot existing names so we can flag duplicates.
    if (!workspace.current) return;
    const wsId = workspace.current.id;
    const [cls, projs, tks] = await Promise.all([
      pb.collection('clients').getFullList({ filter: `workspace = "${wsId}"` }),
      pb.collection('projects').getFullList({ filter: `workspace = "${wsId}"`, expand: 'client' }),
      pb.collection('tasks').getFullList({ filter: `workspace = "${wsId}"` })
    ]);
    const clientNames = new Set<string>(cls.map((c) => c.name));
    const projectKeys = new Set<string>(
      projs.map((p) => `${(p as any).expand?.client?.name ?? ''}__${p.name}`)
    );
    const taskNames = new Set<string>(tks.map((t) => t.name));
    preview = buildPreview(rows, { clientNames, projectKeys, taskNames });
    stage = 'preview';
  }

  async function runImport() {
    if (!workspace.current || !preview) return;
    stage = 'importing';
    const wsId = workspace.current.id;

    // Fetch existing again so we have id lookups
    const [cls, projs, tks] = await Promise.all([
      pb.collection('clients').getFullList({ filter: `workspace = "${wsId}"` }),
      pb.collection('projects').getFullList({ filter: `workspace = "${wsId}"`, expand: 'client' }),
      pb.collection('tasks').getFullList({ filter: `workspace = "${wsId}"` })
    ]);
    const clientByName = new Map<string, string>(cls.map((c) => [c.name, c.id]));
    const projectByKey = new Map<string, string>(
      projs.map((p) => [`${(p as any).expand?.client?.name ?? ''}__${p.name}`, p.id])
    );
    const taskByName = new Map<string, string>(tks.map((t) => [t.name, t.id]));

    let createdClients = 0;
    let createdProjects = 0;
    let createdTasks = 0;
    let createdEntries = 0;

    // Create new clients first
    progress = `Creating ${preview.newClients.length} client(s)…`;
    for (const name of preview.newClients) {
      const c = await pb.collection('clients').create({
        workspace: wsId,
        name,
        default_rate_cents: 0,
        archived: false
      });
      clientByName.set(name, c.id);
      createdClients++;
    }

    // New projects (need to know client's rate for default; use the first row's rate for the project)
    progress = `Creating ${preview.newProjects.length} project(s)…`;
    for (const { client, project } of preview.newProjects) {
      const clientId = clientByName.get(client);
      if (!clientId) continue;
      // First row for this client/project pair — pull its rate to seed the project rate.
      const firstRow = rows.find((r) => r.client === client && r.project === project);
      const p = await pb.collection('projects').create({
        workspace: wsId,
        client: clientId,
        name: project,
        rate_cents: firstRow?.rateCents || null,
        status: 'active',
        color: '#00a5cf'
      });
      projectByKey.set(`${client}__${project}`, p.id);
      createdProjects++;
    }

    // New tasks
    progress = `Creating ${preview.newTasks.length} activity type(s)…`;
    for (const name of preview.newTasks) {
      const t = await pb.collection('tasks').create({
        workspace: wsId,
        name,
        billable_default: true
      });
      taskByName.set(name, t.id);
      createdTasks++;
    }

    // Time entries — group by date so each day starts at 09:00 and advances.
    progress = `Importing ${rows.length} time entries…`;
    const byDate = new Map<string, HarvestRow[]>();
    for (const r of rows) {
      const arr = byDate.get(r.date) ?? [];
      arr.push(r);
      byDate.set(r.date, arr);
    }

    let done = 0;
    for (const [date, dayRows] of byDate) {
      // Sort within the day so order is stable (Harvest's order may vary).
      // We use 09:00 + accumulated.
      let cursorMs = new Date(`${date}T09:00:00`).getTime();
      for (const r of dayRows) {
        const projectId = projectByKey.get(`${r.client}__${r.project}`);
        if (!projectId) continue;
        const taskId = r.task ? taskByName.get(r.task) ?? null : null;
        const startedAt = new Date(cursorMs).toISOString();
        const endedAt = new Date(cursorMs + r.hours * 3_600_000).toISOString();
        await pb.collection('time_entries').create({
          workspace: wsId,
          project: projectId,
          task: taskId,
          started_at: startedAt,
          ended_at: endedAt,
          description: r.notes,
          billable: r.billable,
          rate_cents_snapshot: r.rateCents || null
        });
        cursorMs += r.hours * 3_600_000;
        createdEntries++;
        done++;
        if (done % 25 === 0) progress = `Imported ${done} / ${rows.length}…`;
      }
    }

    result = {
      clients: createdClients,
      projects: createdProjects,
      tasks: createdTasks,
      entries: createdEntries
    };
    stage = 'done';
    progress = '';
  }

  function reset() {
    stage = 'idle';
    rows = [];
    preview = null;
    parseErrors = [];
    result = null;
  }
</script>

<div>
  <h2 class="text-lg font-semibold text-slate-900">Import from Harvest</h2>
  <p class="mt-1 text-sm text-slate-600">
    Upload a Harvest <em>Detailed Time Report</em> CSV (Reports → Detailed → Export
    → CSV). We'll create any missing clients, projects, and activity types, then
    import each row as a time entry. Existing items with the same name are reused —
    nothing gets duplicated.
  </p>

  {#if stage === 'idle' || stage === 'parsing'}
    <div class="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <span class="icon-[ph--upload-simple-duotone] text-3xl text-slate-400" aria-hidden="true"></span>
      <p class="mt-2 text-sm font-medium text-slate-700">Drop your Harvest CSV here</p>
      <input
        type="file"
        accept=".csv,text/csv"
        onchange={onFile}
        class="mt-3 block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-brand-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-800 hover:file:bg-brand-200"
      />
      {#if stage === 'parsing'}
        <p class="mt-3 text-xs text-slate-500">Parsing…</p>
      {/if}
    </div>

    {#if parseErrors.length > 0}
      <div class="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
        <h3 class="text-sm font-medium text-red-900">Parse problems</h3>
        <ul class="mt-2 list-disc pl-5 text-xs text-red-800">
          {#each parseErrors.slice(0, 10) as err}
            <li>Line {err.line}: {err.reason}</li>
          {/each}
          {#if parseErrors.length > 10}
            <li>… and {parseErrors.length - 10} more</li>
          {/if}
        </ul>
      </div>
    {/if}
  {/if}

  {#if stage === 'preview' && preview}
    <div class="mt-6 grid gap-3 sm:grid-cols-4">
      <div class="rounded-lg border border-slate-200 bg-white p-4">
        <div class="text-xs uppercase tracking-wider text-slate-500">Time entries</div>
        <div class="mt-1 font-mono text-2xl font-semibold text-brand-800">{preview.totalRows}</div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-4">
        <div class="text-xs uppercase tracking-wider text-slate-500">New clients</div>
        <div class="mt-1 font-mono text-2xl font-semibold text-brand-800">{preview.newClients.length}</div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-4">
        <div class="text-xs uppercase tracking-wider text-slate-500">New projects</div>
        <div class="mt-1 font-mono text-2xl font-semibold text-brand-800">{preview.newProjects.length}</div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-4">
        <div class="text-xs uppercase tracking-wider text-slate-500">New activity types</div>
        <div class="mt-1 font-mono text-2xl font-semibold text-brand-800">{preview.newTasks.length}</div>
      </div>
    </div>

    {#if preview.rangeStart}
      <p class="mt-3 text-sm text-slate-600">
        Date range: <strong>{preview.rangeStart}</strong> → <strong>{preview.rangeEnd}</strong>
      </p>
    {/if}

    <div class="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div class="border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700">
        Sample (first 10 rows)
      </div>
      <table class="w-full text-sm">
        <thead class="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th class="px-3 py-2">Date</th>
            <th class="px-3 py-2">Client</th>
            <th class="px-3 py-2">Project</th>
            <th class="px-3 py-2">Task</th>
            <th class="px-3 py-2 text-right">Hours</th>
            <th class="px-3 py-2 text-right">Rate</th>
            <th class="px-3 py-2">Billable</th>
          </tr>
        </thead>
        <tbody>
          {#each preview.sample as r}
            <tr class="border-b border-slate-100 last:border-0">
              <td class="px-3 py-2 text-slate-700">{r.date}</td>
              <td class="px-3 py-2 text-slate-700">{r.client}</td>
              <td class="px-3 py-2 text-slate-700">{r.project}</td>
              <td class="px-3 py-2 text-slate-600">{r.task || '—'}</td>
              <td class="px-3 py-2 text-right font-mono text-slate-800">{r.hours.toFixed(2)}</td>
              <td class="px-3 py-2 text-right font-mono text-slate-800">
                {r.rateCents ? formatUSD(r.rateCents) : '—'}
              </td>
              <td class="px-3 py-2 text-slate-600">{r.billable ? 'Yes' : 'No'}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="mt-6 flex gap-2">
      <button
        class="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        onclick={reset}
      >
        Choose a different file
      </button>
      <button
        class="rounded bg-brand-800 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900"
        onclick={runImport}
      >
        Import {preview.totalRows} entries
      </button>
    </div>
  {/if}

  {#if stage === 'importing'}
    <div class="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-center">
      <span class="icon-[ph--circle-notch-duotone] mx-auto block animate-spin text-3xl text-brand-800" aria-hidden="true"></span>
      <p class="mt-2 text-sm font-medium text-slate-700">{progress || 'Importing…'}</p>
      <p class="mt-1 text-xs text-slate-500">Don't close this tab.</p>
    </div>
  {/if}

  {#if stage === 'done' && result}
    <div class="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
      <h3 class="text-sm font-medium text-emerald-900">Import complete</h3>
      <ul class="mt-2 space-y-0.5 text-sm text-emerald-800">
        <li>· {result.entries} time entries</li>
        <li>· {result.clients} new clients</li>
        <li>· {result.projects} new projects</li>
        <li>· {result.tasks} new activity types</li>
      </ul>
      <div class="mt-4 flex gap-2">
        <a
          href="/time"
          class="rounded bg-brand-800 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900"
        >
          Go to Time
        </a>
        <button
          class="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          onclick={reset}
        >
          Import another file
        </button>
      </div>
    </div>
  {/if}
</div>
