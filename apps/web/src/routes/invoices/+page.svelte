<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { pb, toPbDate } from '$lib/pb';
  import { workspace } from '$lib/workspace.svelte';
  import { formatUSD, formatHours, hoursDecimal } from '@timebill/shared/money';
  import { roundHours } from '@timebill/shared/invoice';

  type ClientLite = { id: string; name: string };
  type InvoiceRow = {
    id: string;
    number: string;
    client: string;
    issue_date: string;
    due_date: string;
    status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'void';
    total_cents: number;
    expand?: { client?: ClientLite };
  };

  let invoices = $state<InvoiceRow[]>([]);
  let clients = $state<ClientLite[]>([]);
  let loading = $state(true);
  let error = $state('');
  let showCreate = $state(false);
  let showGenerate = $state(false);
  let generating = $state(false);
  let genError = $state('');

  let genForm = $state({
    client: '',
    month: new Date().toISOString().slice(0, 7) // YYYY-MM
  });

  let statusFilter = $state<'' | 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue'>('');

  let form = $state({
    client: '',
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: addDays(new Date(), 30),
    notes: ''
  });

  function addDays(d: Date, n: number): string {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x.toISOString().slice(0, 10);
  }

  async function load() {
    if (!workspace.current) return;
    loading = true;
    try {
      const [inv, cls] = await Promise.all([
        api.listInvoices(statusFilter ? { status: statusFilter } : {}),
        api.listClients()
      ]);
      invoices = inv as unknown as InvoiceRow[];
      clients = cls as unknown as ClientLite[];
      if (!form.client && clients.length) form.client = clients[0]!.id;
    } finally {
      loading = false;
    }
  }

  async function createDraft(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    try {
      const inv = await api.createDraftInvoice({
        client: form.client,
        issue_date: form.issue_date,
        due_date: form.due_date,
        notes: form.notes
      });
      goto(`/invoices/${inv.id}`);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create';
    }
  }

  /**
   * Generate a draft invoice from every unbilled time entry, expense, and
   * mileage entry for the chosen client in the chosen month. Applies billing
   * rounding to time entries. Navigates to the new draft.
   */
  async function generateFromMonth(e: SubmitEvent) {
    e.preventDefault();
    genError = '';
    generating = true;
    try {
      const [yStr, mStr] = genForm.month.split('-');
      const y = Number(yStr);
      const m = Number(mStr) - 1; // 0-11
      const monthStart = new Date(y, m, 1);
      const monthEnd = new Date(y, m + 1, 1);
      const issueDate = new Date(y, m + 1, 0).toISOString().slice(0, 10); // last day of month
      const dueDate = new Date(y, m + 1, 30).toISOString().slice(0, 10); // ~30 days

      const range = { fromPb: toPbDate(monthStart), toPb: toPbDate(monthEnd) };
      const [times, exps, miles] = await Promise.all([
        api.listUnbilledTimeForClient(genForm.client, range),
        api.listUnbilledExpensesForClient(genForm.client, range),
        api.listUnbilledMileageForClient(genForm.client, range)
      ]);

      if (!times.length && !exps.length && !miles.length) {
        genError = `Nothing unbilled for that client in ${genForm.month}.`;
        return;
      }

      const inv = await api.createDraftInvoice({
        client: genForm.client,
        issue_date: issueDate,
        due_date: dueDate,
        notes: `Generated from ${monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`
      });

      const rounding = workspace.current?.billing_rounding_minutes ?? 0;
      const clientDefaultRate = clients.find((c) => c.id === genForm.client) as unknown as { default_rate_cents?: number } | undefined;
      let order = 0;

      for (const t of times as any[]) {
        const ms = new Date(t.ended_at).getTime() - new Date(t.started_at).getTime();
        const actualHours = Math.max(0, hoursDecimal(ms));
        const billedHours = roundHours(actualHours, rounding);
        const rate =
          t.rate_cents_snapshot ??
          t.expand?.project?.rate_cents ??
          clientDefaultRate?.default_rate_cents ??
          0;
        await api.addLineItem({
          invoice: inv.id,
          description: `${t.expand?.project?.name ?? 'Time'}${t.expand?.task ? ` — ${t.expand.task.name}` : ''}${t.description ? ` · ${t.description}` : ''} (${formatHours(ms)} actual)`,
          quantity: billedHours,
          unit_price_cents: rate,
          source: 'time_entry',
          source_id: t.id,
          sort_order: order++
        });
        await api.markTimeEntryBilled(t.id, inv.id);
      }

      for (const ex of exps as any[]) {
        await api.addLineItem({
          invoice: inv.id,
          description: `${ex.vendor || ex.expand?.category?.name || 'Expense'}${ex.description ? ` · ${ex.description}` : ''}`,
          quantity: 1,
          unit_price_cents: ex.amount_cents,
          source: 'expense',
          source_id: ex.id,
          sort_order: order++
        });
        await api.markExpenseBilled(ex.id, inv.id);
      }

      for (const mi of miles as any[]) {
        await api.addLineItem({
          invoice: inv.id,
          description: `Mileage — ${mi.purpose || 'travel'}`,
          quantity: mi.miles,
          unit_price_cents: mi.rate_cents_snapshot,
          source: 'mileage',
          source_id: mi.id,
          sort_order: order++
        });
        await api.markMileageBilled(mi.id, inv.id);
      }

      // Recompute totals on the freshly populated invoice.
      const lines = await api.listLineItems(inv.id);
      const subtotal = (lines as any[]).reduce((s, l) => s + l.amount_cents, 0);
      await api.updateInvoice(inv.id, { subtotal_cents: subtotal, total_cents: subtotal });

      goto(`/invoices/${inv.id}`);
    } catch (err) {
      genError = err instanceof Error ? err.message : 'Generation failed';
    } finally {
      generating = false;
    }
  }

  function fmtDate(s: string): string {
    const ymd = s.slice(0, 10).split('-').map(Number);
    if (ymd.length === 3 && !ymd.some(Number.isNaN)) {
      const [y, m, d] = ymd as [number, number, number];
      return new Date(y, m - 1, d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return s.slice(0, 10);
  }

  const STATUS_STYLE: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600',
    sent: 'bg-brand-100 text-brand-800',
    viewed: 'bg-brand-200 text-brand-900',
    paid: 'bg-emerald-100 text-emerald-700',
    overdue: 'bg-red-100 text-red-700',
    void: 'bg-slate-200 text-slate-500'
  };

  let totals = $derived.by(() => {
    let outstanding = 0;
    let paid = 0;
    for (const inv of invoices) {
      if (inv.status === 'paid') paid += inv.total_cents;
      else if (inv.status === 'sent' || inv.status === 'viewed' || inv.status === 'overdue')
        outstanding += inv.total_cents;
    }
    return { outstanding, paid };
  });

  onMount(load);
  $effect(() => {
    void statusFilter;
    if (workspace.current) load();
  });
</script>

<div class="mx-auto max-w-6xl px-8 py-8">
  <div class="flex items-end justify-between">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Invoices</h1>
      <p class="mt-1 text-sm text-slate-600">Draft, send, and track client payments.</p>
    </div>
    <div class="flex gap-2">
      <button
        class="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        onclick={() => {
          if (!genForm.client && clients.length) genForm.client = clients[0]!.id;
          showGenerate = true;
        }}
        disabled={clients.length === 0}
      >
        <span class="icon-[ph--calendar-plus-duotone] text-base" aria-hidden="true"></span>
        Generate from month…
      </button>
      <button
        class="rounded-md bg-brand-800 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900 disabled:opacity-50"
        onclick={() => (showCreate = true)}
        disabled={clients.length === 0}
      >
        + New invoice
      </button>
    </div>
  </div>

  <section class="mt-5 grid gap-3 sm:grid-cols-2">
    <div class="rounded-lg border border-slate-200 bg-white p-4">
      <div class="text-xs uppercase tracking-wider text-slate-500">Outstanding</div>
      <div class="mt-1 font-mono text-2xl font-semibold text-brand-800">
        {formatUSD(totals.outstanding)}
      </div>
    </div>
    <div class="rounded-lg border border-slate-200 bg-white p-4">
      <div class="text-xs uppercase tracking-wider text-slate-500">Paid (visible)</div>
      <div class="mt-1 font-mono text-2xl font-semibold text-brand-800">
        {formatUSD(totals.paid)}
      </div>
    </div>
  </section>

  <div class="mt-5 flex flex-wrap gap-2">
    {#each [['', 'All'], ['draft', 'Draft'], ['sent', 'Sent'], ['viewed', 'Viewed'], ['paid', 'Paid'], ['overdue', 'Overdue']] as [value, label]}
      <button
        class="rounded-full px-3 py-1 text-xs font-medium transition
          {statusFilter === value ? 'bg-brand-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}"
        onclick={() => (statusFilter = value as typeof statusFilter)}
      >
        {label}
      </button>
    {/each}
  </div>

  <div class="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
    {#if loading}
      <div class="p-8 text-center text-sm text-slate-500">Loading…</div>
    {:else if invoices.length === 0}
      <div class="p-12 text-center">
        <p class="text-slate-500">No invoices yet.</p>
        <button
          class="mt-3 text-sm text-brand-600 hover:underline"
          onclick={() => (showCreate = true)}
          disabled={clients.length === 0}
        >
          {clients.length ? 'Create your first invoice →' : 'Add a client first'}
        </button>
      </div>
    {:else}
      <table class="w-full text-sm">
        <thead
          class="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500"
        >
          <tr>
            <th class="px-5 py-3 font-medium">Number</th>
            <th class="px-5 py-3 font-medium">Client</th>
            <th class="px-5 py-3 font-medium">Issued</th>
            <th class="px-5 py-3 font-medium">Due</th>
            <th class="px-5 py-3 font-medium">Status</th>
            <th class="px-5 py-3 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {#each invoices as inv (inv.id)}
            <tr
              class="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50"
              onclick={() => goto(`/invoices/${inv.id}`)}
            >
              <td class="px-5 py-3 font-mono font-medium text-slate-900">{inv.number}</td>
              <td class="px-5 py-3 text-slate-700">{inv.expand?.client?.name ?? '—'}</td>
              <td class="px-5 py-3 text-slate-600">{fmtDate(inv.issue_date)}</td>
              <td class="px-5 py-3 text-slate-600">{fmtDate(inv.due_date)}</td>
              <td class="px-5 py-3">
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-medium capitalize {STATUS_STYLE[inv.status] ?? ''}"
                >
                  {inv.status}
                </span>
              </td>
              <td class="px-5 py-3 text-right font-mono text-slate-800">
                {formatUSD(inv.total_cents)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

{#if showCreate}
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4" role="dialog">
    <form
      onsubmit={createDraft}
      class="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl"
    >
      <h2 class="text-lg font-semibold text-slate-900">New invoice</h2>

      <label class="block">
        <span class="text-sm text-slate-700">Client</span>
        <select
          required
          bind:value={form.client}
          class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          {#each clients as c}
            <option value={c.id}>{c.name}</option>
          {/each}
        </select>
      </label>

      <div class="grid grid-cols-2 gap-3">
        <label class="block">
          <span class="text-sm text-slate-700">Issue date</span>
          <input
            type="date"
            required
            bind:value={form.issue_date}
            class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </label>
        <label class="block">
          <span class="text-sm text-slate-700">Due date</span>
          <input
            type="date"
            required
            bind:value={form.due_date}
            class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </label>
      </div>

      <label class="block">
        <span class="text-sm text-slate-700">Notes (optional)</span>
        <textarea
          rows="3"
          bind:value={form.notes}
          class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        ></textarea>
      </label>

      {#if error}
        <p class="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      {/if}

      <div class="flex justify-end gap-2 pt-1">
        <button
          type="button"
          class="rounded px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
          onclick={() => (showCreate = false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded bg-brand-800 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900"
        >
          Create draft
        </button>
      </div>
    </form>
  </div>
{/if}

{#if showGenerate}
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4" role="dialog">
    <form
      onsubmit={generateFromMonth}
      class="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl"
    >
      <h2 class="text-lg font-semibold text-slate-900">Generate invoice from month</h2>
      <p class="text-sm text-slate-600">
        Pulls every unbilled <strong>time entry</strong>, <strong>expense</strong>,
        and <strong>mileage entry</strong> for this client in the chosen month
        into a new draft. Applies your billing-rounding setting to time.
      </p>

      <label class="block">
        <span class="text-sm text-slate-700">Client</span>
        <select
          required
          bind:value={genForm.client}
          class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          {#each clients as c}
            <option value={c.id}>{c.name}</option>
          {/each}
        </select>
      </label>

      <label class="block">
        <span class="text-sm text-slate-700">Month</span>
        <input
          type="month"
          required
          bind:value={genForm.month}
          class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </label>

      {#if genError}
        <p class="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{genError}</p>
      {/if}

      <div class="flex justify-end gap-2 pt-1">
        <button
          type="button"
          class="rounded px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
          onclick={() => (showGenerate = false)}
          disabled={generating}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded bg-brand-800 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900 disabled:opacity-50"
          disabled={generating}
        >
          {generating ? 'Generating…' : 'Generate draft'}
        </button>
      </div>
    </form>
  </div>
{/if}
