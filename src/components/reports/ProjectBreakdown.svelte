<script>
  import { projectTotals } from '../../store/derived.js'
  import { formatHours, formatDuration } from '../../utils/time.js'
  import { formatCurrency } from '../../utils/money.js'

  const COLOR_MAP = {
    teal: 'bg-teal-500', violet: 'bg-violet-500', rose: 'bg-rose-500',
    amber: 'bg-amber-500', blue: 'bg-blue-500', green: 'bg-green-500',
    orange: 'bg-orange-500', pink: 'bg-pink-500',
  }

  $: totalSeconds = $projectTotals.reduce((s, r) => s + r.seconds, 0)
  $: totalCost = $projectTotals.reduce((s, r) => s + r.cost, 0)
</script>

<div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
  <div class="px-4 py-3 border-b border-slate-700">
    <h3 class="text-sm font-semibold text-slate-200">By Project</h3>
  </div>

  {#if $projectTotals.length === 0}
    <p class="text-sm text-slate-500 p-4">No entries yet.</p>
  {:else}
    <div class="divide-y divide-slate-700/50">
      {#each $projectTotals as row}
        <div class="flex items-center gap-3 px-4 py-2.5">
          <span class="{COLOR_MAP[row.client?.color] ?? 'bg-slate-500'} w-2 h-2 rounded-full flex-shrink-0"></span>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-slate-200 truncate">{row.project.name}</p>
            <p class="text-xs text-slate-400 truncate">{row.client?.name ?? '—'}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-mono text-slate-200 tabular-nums">{formatHours(row.seconds)} h</p>
            {#if row.cost > 0}
              <p class="text-xs text-teal-400">{formatCurrency(row.cost)}</p>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- Totals row -->
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
