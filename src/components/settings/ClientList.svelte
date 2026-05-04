<script>
  import { clients } from '../../store/index.js'
  import { deleteClient } from '../../store/actions.js'
  import ClientForm from './ClientForm.svelte'
  import { Pencil, Trash2, Plus } from 'lucide-svelte'

  const COLOR_MAP = {
    teal: 'bg-teal-500', violet: 'bg-violet-500', rose: 'bg-rose-500',
    amber: 'bg-amber-500', blue: 'bg-blue-500', green: 'bg-green-500',
    orange: 'bg-orange-500', pink: 'bg-pink-500',
  }

  let editing = null   // client object or 'new'
</script>

{#if editing === 'new' || editing?.id}
  <ClientForm
    client={editing === 'new' ? null : editing}
    onDone={() => editing = null}
  />
{:else}
  <div class="p-4 space-y-2">
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Clients</span>
      <button
        on:click={() => editing = 'new'}
        class="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300"
      >
        <Plus size={14}/> Add
      </button>
    </div>

    {#if $clients.length === 0}
      <p class="text-sm text-slate-500 py-2">No clients yet.</p>
    {/if}

    {#each $clients as client (client.id)}
      <div class="flex items-center gap-2 py-1.5 group">
        <span class="{COLOR_MAP[client.color] ?? 'bg-slate-500'} w-2.5 h-2.5 rounded-full flex-shrink-0"></span>
        <span class="text-sm text-slate-200 flex-1 truncate">{client.name}</span>
        <button
          on:click={() => editing = client}
          class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-opacity"
          aria-label="Edit"
        ><Pencil size={13}/></button>
        <button
          on:click={() => {
            if (confirm(`Delete "${client.name}" and all its projects/entries?`)) {
              deleteClient(client.id)
            }
          }}
          class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 transition-opacity"
          aria-label="Delete"
        ><Trash2 size={13}/></button>
      </div>
    {/each}
  </div>
{/if}
