<script>
  import { projects, clients } from '../../store/index.js'
  import { deleteEntry } from '../../store/actions.js'
  import { formatDuration } from '../../utils/time.js'
  import { computeCost, formatCurrency } from '../../utils/money.js'
  import { Trash2 } from 'lucide-svelte'

  export let entry

  const COLOR_MAP = {
    teal: 'bg-teal-500', violet: 'bg-violet-500', rose: 'bg-rose-500',
    amber: 'bg-amber-500', blue: 'bg-blue-500', green: 'bg-green-500',
    orange: 'bg-orange-500', pink: 'bg-pink-500',
  }

  $: project = $projects.find(p => p.id === entry.projectId)
  $: client = $clients.find(c => c.id === entry.clientId)
  $: cost = computeCost(entry.durationSeconds, project?.hourlyRate ?? 0)
</script>

<div class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/60 group transition-colors">
  <span class="{COLOR_MAP[client?.color] ?? 'bg-slate-600'} w-1.5 h-1.5 rounded-full flex-shrink-0"></span>
  <div class="flex-1 min-w-0">
    <p class="text-sm text-slate-300 truncate">{project?.name ?? '—'}</p>
    {#if entry.notes}
      <p class="text-xs text-slate-500 truncate">{entry.notes}</p>
    {/if}
  </div>
  <span class="font-mono text-sm text-slate-400 tabular-nums">{formatDuration(entry.durationSeconds)}</span>
  {#if (project?.hourlyRate ?? 0) > 0}
    <span class="text-xs text-teal-500">{formatCurrency(cost)}</span>
  {/if}
  <button
    on:click={() => deleteEntry(entry.id)}
    class="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity ml-1"
    aria-label="Delete entry"
  ><Trash2 size={12}/></button>
</div>
