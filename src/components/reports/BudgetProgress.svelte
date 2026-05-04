<script>
  import { budgetProgress } from '../../store/derived.js'
  import { projects, clients } from '../../store/index.js'
  import { formatHours } from '../../utils/time.js'
</script>

{#if $budgetProgress.length > 0}
  <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
    <div class="px-4 py-3 border-b border-slate-700">
      <h3 class="text-sm font-semibold text-slate-200">Monthly Budgets</h3>
    </div>
    <div class="p-4 space-y-4">
      {#each $budgetProgress as row}
        {@const client = $clients.find(c => c.id === row.project.clientId)}
        <div>
          <div class="flex items-center justify-between mb-1.5 gap-2">
            <div class="min-w-0">
              <p class="text-sm text-slate-200 truncate">{row.project.name}</p>
              <p class="text-xs text-slate-400 truncate">{client?.name ?? '—'}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-xs text-slate-300 tabular-nums">
                {formatHours(row.usedSeconds)} / {row.project.monthlyHourBudget} h
              </p>
              <p class="text-xs {row.pct >= 100 ? 'text-rose-400' : row.pct >= 80 ? 'text-amber-400' : 'text-teal-400'}">
                {Math.min(row.pct, 100).toFixed(0)}%
              </p>
            </div>
          </div>
          <!-- Track -->
          <div class="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500
                     {row.pct >= 100 ? 'bg-rose-500' : row.pct >= 80 ? 'bg-amber-400' : 'bg-teal-500'}"
              style="width: {Math.min(row.pct, 100)}%"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
