<script>
  import { entries, clients, projects, invoiceClientId } from '../../store/index.js'
  import { archiveEntriesForClient } from '../../store/actions.js'
  import { formatDuration, formatDate } from '../../utils/time.js'
  import { computeCost, formatCurrency } from '../../utils/money.js'
  import { X, Printer, Archive } from 'lucide-svelte'

  $: clientId = $invoiceClientId
  $: client   = $clients.find(c => c.id === clientId)

  $: uninvoiced = [...$entries]
    .filter(e => e.clientId === clientId && !e.archived)
    .sort((a, b) => a.startedAt - b.startedAt)

  $: projectIds = [...new Set(uninvoiced.map(e => e.projectId))]
  $: groups = projectIds.map(pid => {
    const project = $projects.find(p => p.id === pid)
    const projectEntries = uninvoiced.filter(e => e.projectId === pid)
    const totalSeconds = projectEntries.reduce((s, e) => s + e.durationSeconds, 0)
    const totalCost    = projectEntries.reduce((s, e) =>
      s + computeCost(e.durationSeconds, project?.hourlyRate ?? 0), 0)
    return { project, entries: projectEntries, totalSeconds, totalCost }
  })

  $: grandTotalSeconds = uninvoiced.reduce((s, e) => s + e.durationSeconds, 0)
  $: grandTotalCost    = groups.reduce((s, g) => s + g.totalCost, 0)

  const invoiceDate   = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const invoiceNumber = 'INV-' + new Date().toISOString().slice(0, 10).replace(/-/g, '')

  function close() { invoiceClientId.set(null) }

  function archiveAndClose() {
    archiveEntriesForClient(clientId)
    close()
  }
</script>

<!-- Backdrop -->
<div
  class="fixed inset-0 z-40 bg-black/70 print:hidden"
  role="presentation"
  on:click|self={close}
  on:keydown={e => e.key === 'Escape' && close()}
></div>

<!-- Invoice panel -->
<div class="invoice-panel fixed inset-0 z-50 overflow-y-auto">
  <div class="min-h-full bg-white text-slate-900 px-8 py-6 max-w-3xl mx-auto">

    <!-- Action bar (hidden on print) -->
    <div class="no-print flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
      <h2 class="text-lg font-semibold text-slate-800">Invoice Preview</h2>
      <div class="flex items-center gap-2">
        <button
          on:click={() => window.print()}
          class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700
                 rounded-lg text-sm font-medium transition-colors"
        >
          <Printer size={14}/> Print
        </button>
        <button
          on:click={archiveAndClose}
          disabled={uninvoiced.length === 0}
          class="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white
                 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Archive size={14}/> Archive &amp; Close
        </button>
        <button on:click={close} class="text-slate-400 hover:text-slate-700 transition-colors ml-1">
          <X size={18}/>
        </button>
      </div>
    </div>

    {#if uninvoiced.length === 0}
      <p class="text-slate-500 text-sm py-12 text-center">No uninvoiced entries for {client?.name}.</p>
    {:else}
      <!-- Invoice header -->
      <div class="flex justify-between items-start mb-8">
        <div>
          <p class="text-2xl font-bold tracking-tight text-slate-900">INVOICE</p>
          <p class="text-sm text-slate-500 mt-1">{invoiceNumber}</p>
        </div>
        <div class="text-right text-sm">
          <p class="text-slate-500">Date</p>
          <p class="font-medium">{invoiceDate}</p>
          <p class="text-slate-500 mt-2">Bill To</p>
          <p class="font-semibold text-base">{client?.name}</p>
        </div>
      </div>

      <!-- Per-project tables -->
      {#each groups as group}
        <div class="mb-8">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            {group.project?.name ?? 'Unknown Project'}
          </p>
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b-2 border-slate-200">
                <th class="text-left py-2 pr-4 text-slate-600 font-semibold w-24">Date</th>
                <th class="text-left py-2 pr-4 text-slate-600 font-semibold">Notes</th>
                <th class="text-right py-2 pr-4 text-slate-600 font-semibold w-24">Duration</th>
                <th class="text-right py-2 text-slate-600 font-semibold w-24">Amount</th>
              </tr>
            </thead>
            <tbody>
              {#each group.entries as entry}
                <tr class="border-b border-slate-100">
                  <td class="py-2 pr-4 text-slate-600 tabular-nums">{formatDate(entry.date)}</td>
                  <td class="py-2 pr-4 text-slate-700">{entry.notes || '—'}</td>
                  <td class="py-2 pr-4 text-right font-mono tabular-nums text-slate-700">
                    {formatDuration(entry.durationSeconds)}
                  </td>
                  <td class="py-2 text-right tabular-nums text-slate-800">
                    {#if (group.project?.hourlyRate ?? 0) > 0}
                      {formatCurrency(computeCost(entry.durationSeconds, group.project.hourlyRate))}
                    {:else}
                      —
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
            <tfoot>
              <tr class="border-t-2 border-slate-300">
                <td colspan="2" class="py-2 text-right pr-4 text-sm font-semibold text-slate-600">Subtotal</td>
                <td class="py-2 pr-4 text-right font-mono tabular-nums font-semibold">
                  {formatDuration(group.totalSeconds)}
                </td>
                <td class="py-2 text-right font-semibold">
                  {#if group.totalCost > 0}{formatCurrency(group.totalCost)}{:else}—{/if}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      {/each}

      <!-- Grand total -->
      <div class="border-t-4 border-slate-900 pt-4 mt-2">
        <div class="flex justify-between items-baseline">
          <span class="text-base font-bold uppercase tracking-wider">Total Due</span>
          <div class="text-right">
            <p class="text-2xl font-bold tabular-nums">{formatCurrency(grandTotalCost)}</p>
            <p class="text-xs text-slate-500 mt-0.5">{formatDuration(grandTotalSeconds)} total</p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  @media print {
    :global(body) { background: white; }
    :global(#app) { visibility: hidden; }
    .invoice-panel {
      visibility: visible;
      position: fixed;
      inset: 0;
      overflow: visible;
      height: auto;
      background: white;
    }
    .no-print { display: none !important; }
  }
</style>
