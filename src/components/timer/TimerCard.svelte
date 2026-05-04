<script>
  import { projects, clients } from '../../store/index.js'
  import { stopTimer, updateTimerNotes } from '../../store/actions.js'
  import { formatDuration, formatHours } from '../../utils/time.js'
  import { computeCost, formatCurrency } from '../../utils/money.js'
  import { Square, ChevronDown, ChevronUp } from 'lucide-svelte'

  export let timer
  export let now

  const COLOR_MAP = {
    teal: 'bg-teal-500', violet: 'bg-violet-500', rose: 'bg-rose-500',
    amber: 'bg-amber-500', blue: 'bg-blue-500', green: 'bg-green-500',
    orange: 'bg-orange-500', pink: 'bg-pink-500',
  }

  $: project = $projects.find(p => p.id === timer.projectId)
  $: client = $clients.find(c => c.id === timer.clientId)
  $: elapsedSeconds = Math.max(0, Math.floor((now - timer.startedAt) / 1000))
  $: cost = computeCost(elapsedSeconds, project?.hourlyRate ?? 0)

  let expanded = false
  let notes = timer.notes

  function handleNotesBlur() {
    updateTimerNotes(timer.id, notes)
  }
</script>

<div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
  <div class="flex items-center gap-3 px-4 py-3">
    <!-- Color chip -->
    <span class="{COLOR_MAP[client?.color] ?? 'bg-slate-500'} w-1 self-stretch rounded-full flex-shrink-0"></span>

    <!-- Project / client info -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-slate-100 truncate">{project?.name ?? 'Unknown project'}</p>
      <p class="text-xs text-slate-400 truncate">{client?.name ?? '—'}</p>
    </div>

    <!-- Elapsed time -->
    <div class="text-right mr-1">
      <p class="font-mono text-lg font-semibold text-white tabular-nums leading-tight">
        {formatDuration(elapsedSeconds)}
      </p>
      {#if (project?.hourlyRate ?? 0) > 0}
        <p class="text-xs text-teal-400 font-medium">{formatCurrency(cost)}</p>
      {/if}
    </div>

    <!-- Stop button -->
    <button
      on:click={() => stopTimer(timer.id)}
      class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg
             bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 hover:text-rose-300 transition-colors"
      aria-label="Stop timer"
    >
      <Square size={16} fill="currentColor"/>
    </button>

    <!-- Expand notes -->
    <button
      on:click={() => expanded = !expanded}
      class="text-slate-500 hover:text-slate-300 transition-colors"
      aria-label="Toggle notes"
    >
      {#if expanded}<ChevronUp size={16}/>{:else}<ChevronDown size={16}/>{/if}
    </button>
  </div>

  {#if expanded}
    <div class="px-4 pb-3 pt-0 border-t border-slate-700/50">
      <textarea
        bind:value={notes}
        on:blur={handleNotesBlur}
        placeholder="Add a note…"
        rows="2"
        class="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100
               placeholder-slate-500 resize-none focus:outline-none focus:ring-1 focus:ring-teal-500 mt-2"
      ></textarea>
    </div>
  {/if}
</div>
