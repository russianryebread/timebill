<script>
  import { clientTotals } from '../../store/derived.js'
  import { entries, invoiceClientId } from '../../store/index.js'
  import { formatHours } from '../../utils/time.js'
  import { formatCurrency } from '../../utils/money.js'
  import { FileText } from 'lucide-svelte'

  const COLOR_MAP = {
    teal: 'bg-teal-500', violet: 'bg-violet-500', rose: 'bg-rose-500',
    amber: 'bg-amber-500', blue: 'bg-blue-500', green: 'bg-green-500',
    orange: 'bg-orange-500', pink: 'bg-pink-500',
  }

  $: totalSeconds = $clientTotals.reduce((s, r) => s + r.seconds, 0)
  $: totalCost    = $clientTotals.reduce((s, r) => s + r.cost, 0)

  function hasUninvoiced(clientId) {
    return $entries.some(e => e.clientId === clientId && !e.archived)
  }
</script>

<div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
  <div class="px-4 py-3 border-b border-slate-700">
    <h3 class="text-sm font-semibold text-slate-200">By Client</h3>
  </div>

  {#if $clientTotals.length === 0}
    <p class="text-sm text-slate-500 p-4">No entries yet.</p>
  {:else}
    <div class="divide-y divide-slate-700/50">
      {#each $clientTotals as row}
        <div class="flex items-center gap-3 px-4 py-2.5">
          <span class="{COLOR_MAP[row.client?.color] ?? 'bg-slate-500'} w-2.5 h-2.5 rounded-full flex-shrink-0"></span>
          <span class="flex-1 text-sm text-slate-200 truncate">{row.client.name}</span>
          <div class="text-right">
            <p class="text-sm font-mono text-slate-200 tabular-nums">{formatHours(row.seconds)} h</p>
            {#if row.cost > 0}
              <p class="text-xs text-teal-400">{formatCurrency(row.cost)}</p>
            {/if}
          </div>
          {#if hasUninvoiced(row.client.id)}
            <button
              on:click={() => invoiceClientId.set(row.client.id)}
              class="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                     text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ml-1"
              title="Generate invoice"
            >
              <FileText size={13}/> Invoice
            </button>
          {/if}
        </div>
      {/each}
    </div>

    <div class="flex items-center justify-between px-4 py-2.5 bg-slate-700/30 border-t border-slate-700">
      <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</span>
      <div class="text-right">
        <p class="text-sm font-mono font-semibold text-slate-100 tabular-nums">{formatHours(totalSeconds)} h</p>
        {#if totalCost > 0}
          <p class="text-xs text-teal-400 font-medium">{formatCurrency(totalCost)}</p>
        {/if}
      </div>
    </div>
  {/if}
</div>
