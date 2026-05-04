<script>
  import { projects, clients } from '../../store/index.js'
  import { startTimer } from '../../store/actions.js'
  import { X, Search } from 'lucide-svelte'

  export let onClose = () => {}

  const COLOR_MAP = {
    teal: 'bg-teal-500', violet: 'bg-violet-500', rose: 'bg-rose-500',
    amber: 'bg-amber-500', blue: 'bg-blue-500', green: 'bg-green-500',
    orange: 'bg-orange-500', pink: 'bg-pink-500',
  }

  let search = ''

  $: activeProjects = $projects.filter(p => !p.archived)

  $: grouped = $clients
    .map(client => ({
      client,
      projects: activeProjects.filter(p =>
        p.clientId === client.id &&
        (search === '' || p.name.toLowerCase().includes(search.toLowerCase()) ||
          client.name.toLowerCase().includes(search.toLowerCase()))
      ),
    }))
    .filter(g => g.projects.length > 0)

  function pick(projectId) {
    startTimer(projectId)
    onClose()
  }
</script>

<!-- Backdrop -->
<div
  class="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
  role="presentation"
  on:click|self={onClose}
  on:keydown={e => e.key === 'Escape' && onClose()}
>
  <!-- Sheet -->
  <div class="bg-slate-800 w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[80dvh]">
    <div class="flex items-center justify-between px-4 pt-4 pb-3">
      <h2 class="text-sm font-semibold text-slate-100">Start Timer</h2>
      <button on:click={onClose} class="text-slate-400 hover:text-white"><X size={18}/></button>
    </div>

    <!-- Search -->
    <div class="px-4 pb-3">
      <div class="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2">
        <Search size={14} class="text-slate-400 flex-shrink-0"/>
        <input
          type="text"
          placeholder="Search projects…"
          bind:value={search}
          class="bg-transparent text-sm text-slate-100 placeholder-slate-400 outline-none flex-1"
        />
      </div>
    </div>

    <!-- List -->
    <div class="overflow-y-auto flex-1 pb-4">
      {#if grouped.length === 0}
        <p class="text-sm text-slate-400 text-center py-8">
          {#if $clients.length === 0}
            Add a client in Settings first.
          {:else if activeProjects.length === 0}
            Add a project in Settings first.
          {:else}
            No matches.
          {/if}
        </p>
      {/if}

      {#each grouped as group}
        <div class="px-4 pt-2">
          <div class="flex items-center gap-2 mb-1">
            <span class="{COLOR_MAP[group.client.color] ?? 'bg-slate-500'} w-2 h-2 rounded-full"></span>
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{group.client.name}</span>
          </div>
          {#each group.projects as project}
            <button
              class="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-100
                     hover:bg-slate-700 active:bg-slate-600 transition-colors mb-0.5"
              on:click={() => pick(project.id)}
            >
              {project.name}
            </button>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>
