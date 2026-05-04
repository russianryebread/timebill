<script>
  import { projects, clients, view } from '../../store/index.js'
  import { deleteEntry, updateEntryDuration, startTimer } from '../../store/actions.js'
  import { formatDuration } from '../../utils/time.js'
  import { computeCost, formatCurrency } from '../../utils/money.js'
  import { Trash2, Play, Pencil, Check, X } from 'lucide-svelte'

  export let entry

  const COLOR_MAP = {
    teal: 'bg-teal-500', violet: 'bg-violet-500', rose: 'bg-rose-500',
    amber: 'bg-amber-500', blue: 'bg-blue-500', green: 'bg-green-500',
    orange: 'bg-orange-500', pink: 'bg-pink-500',
  }

  $: project = $projects.find(p => p.id === entry.projectId)
  $: client  = $clients.find(c => c.id === entry.clientId)
  $: cost    = computeCost(entry.durationSeconds, project?.hourlyRate ?? 0)

  let editing = false
  let draftH = 0
  let draftM = 0

  function startEdit() {
    const totalMinutes = Math.ceil(entry.durationSeconds / 60)
    draftH = Math.floor(totalMinutes / 60)
    draftM = totalMinutes % 60
    editing = true
  }

  function saveEdit() {
    const secs = (parseInt(draftH) || 0) * 3600 + (parseInt(draftM) || 0) * 60
    if (secs > 0) updateEntryDuration(entry.id, secs)
    editing = false
  }

  function handleKey(e) {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') editing = false
  }

  function restart() {
    startTimer(entry.projectId)
    view.set('timer')
  }
</script>

<div class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/60 group transition-colors">
  <span class="{COLOR_MAP[client?.color] ?? 'bg-slate-600'} w-1.5 h-1.5 rounded-full flex-shrink-0"></span>

  <div class="flex-1 min-w-0">
    <p class="text-sm text-slate-300 truncate">{project?.name ?? '—'}</p>
    {#if entry.notes && !editing}
      <p class="text-xs text-slate-500 truncate">{entry.notes}</p>
    {/if}
  </div>

  {#if editing}
    <div class="flex items-center gap-1">
      <input
        type="number" min="0" max="99"
        bind:value={draftH}
        on:keydown={handleKey}
        class="w-10 bg-slate-700 border border-slate-500 rounded px-1 py-0.5 text-xs text-slate-100
               text-center focus:outline-none focus:ring-1 focus:ring-teal-500"
      />
      <span class="text-slate-500 text-xs">h</span>
      <input
        type="number" min="0" max="59"
        bind:value={draftM}
        on:keydown={handleKey}
        class="w-10 bg-slate-700 border border-slate-500 rounded px-1 py-0.5 text-xs text-slate-100
               text-center focus:outline-none focus:ring-1 focus:ring-teal-500"
      />
      <span class="text-slate-500 text-xs">m</span>
    </div>
    <button on:click={saveEdit} class="text-teal-400 hover:text-teal-300 transition-colors" aria-label="Save">
      <Check size={14}/>
    </button>
    <button on:click={() => editing = false} class="text-slate-500 hover:text-slate-300 transition-colors" aria-label="Cancel">
      <X size={14}/>
    </button>
  {:else}
    <span class="font-mono text-sm text-slate-400 tabular-nums">{formatDuration(entry.durationSeconds)}</span>
    {#if (project?.hourlyRate ?? 0) > 0}
      <span class="text-xs text-teal-500">{formatCurrency(cost)}</span>
    {/if}
    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
      <button on:click={restart} class="text-slate-500 hover:text-teal-400 transition-colors" aria-label="Restart timer">
        <Play size={12}/>
      </button>
      <button on:click={startEdit} class="text-slate-500 hover:text-slate-300 transition-colors" aria-label="Edit duration">
        <Pencil size={12}/>
      </button>
      <button on:click={() => deleteEntry(entry.id)} class="text-slate-500 hover:text-rose-400 transition-colors" aria-label="Delete entry">
        <Trash2 size={12}/>
      </button>
    </div>
  {/if}
</div>
