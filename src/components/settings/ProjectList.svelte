<script>
  import { projects, clients } from '../../store/index.js'
  import { archiveProject, updateProject } from '../../store/actions.js'
  import ProjectForm from './ProjectForm.svelte'
  import { Pencil, Archive, ArchiveRestore, Plus } from 'lucide-svelte'

  const COLOR_MAP = {
    teal: 'bg-teal-500', violet: 'bg-violet-500', rose: 'bg-rose-500',
    amber: 'bg-amber-500', blue: 'bg-blue-500', green: 'bg-green-500',
    orange: 'bg-orange-500', pink: 'bg-pink-500',
  }

  let editing = null
  let showArchived = false

  $: visible = $projects.filter(p => showArchived ? p.archived : !p.archived)
</script>

{#if editing === 'new' || editing?.id}
  <ProjectForm
    project={editing === 'new' ? null : editing}
    onDone={() => editing = null}
  />
{:else}
  <div class="p-4 space-y-2">
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Projects</span>
      <button
        on:click={() => editing = 'new'}
        class="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300"
        disabled={$clients.length === 0}
      >
        <Plus size={14}/> Add
      </button>
    </div>

    {#if $clients.length === 0}
      <p class="text-sm text-slate-500 py-2">Add a client first.</p>
    {:else if visible.length === 0}
      <p class="text-sm text-slate-500 py-2">No {showArchived ? 'archived' : 'active'} projects.</p>
    {/if}

    {#each visible as project (project.id)}
      {@const client = $clients.find(c => c.id === project.clientId)}
      <div class="flex items-center gap-2 py-1.5 group">
        <span class="{COLOR_MAP[client?.color] ?? 'bg-slate-500'} w-2.5 h-2.5 rounded-full flex-shrink-0"></span>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-slate-200 truncate">{project.name}</p>
          <p class="text-xs text-slate-400 truncate">{client?.name ?? '—'}</p>
        </div>
        <button
          on:click={() => editing = project}
          class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-opacity"
          aria-label="Edit"
        ><Pencil size={13}/></button>
        <button
          on:click={() => updateProject(project.id, { archived: !project.archived })}
          class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-amber-400 transition-opacity"
          aria-label={project.archived ? 'Restore' : 'Archive'}
        >
          {#if project.archived}
            <ArchiveRestore size={13}/>
          {:else}
            <Archive size={13}/>
          {/if}
        </button>
      </div>
    {/each}

    <button
      on:click={() => showArchived = !showArchived}
      class="text-xs text-slate-500 hover:text-slate-300 mt-2"
    >
      {showArchived ? 'Hide archived' : 'Show archived'}
    </button>
  </div>
{/if}
