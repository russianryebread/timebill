<script>
  import { addClient, updateClient } from '../../store/actions.js'
  import { X } from 'lucide-svelte'

  export let client = null  // null = new, object = edit
  export let onDone = () => {}

  const COLORS = [
    { name: 'teal',   bg: 'bg-teal-500',   hex: '#14b8a6' },
    { name: 'violet', bg: 'bg-violet-500',  hex: '#8b5cf6' },
    { name: 'rose',   bg: 'bg-rose-500',    hex: '#f43f5e' },
    { name: 'amber',  bg: 'bg-amber-500',   hex: '#f59e0b' },
    { name: 'blue',   bg: 'bg-blue-500',    hex: '#3b82f6' },
    { name: 'green',  bg: 'bg-green-500',   hex: '#22c55e' },
    { name: 'orange', bg: 'bg-orange-500',  hex: '#f97316' },
    { name: 'pink',   bg: 'bg-pink-500',    hex: '#ec4899' },
  ]

  let name = client?.name ?? ''
  let color = client?.color ?? 'teal'

  function save() {
    const trimmed = name.trim()
    if (!trimmed) return
    if (client) {
      updateClient(client.id, { name: trimmed, color })
    } else {
      addClient({ name: trimmed, color })
    }
    onDone()
  }
</script>

<div class="p-4 space-y-3">
  <div class="flex items-center justify-between">
    <h3 class="text-sm font-semibold text-slate-200">{client ? 'Edit Client' : 'New Client'}</h3>
    <button on:click={onDone} class="text-slate-400 hover:text-white"><X size={16}/></button>
  </div>

  <input
    type="text"
    placeholder="Client name"
    bind:value={name}
    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-400
           focus:outline-none focus:ring-2 focus:ring-teal-500"
    on:keydown={e => e.key === 'Enter' && save()}
  />

  <div class="flex gap-2 flex-wrap">
    {#each COLORS as c}
      <button
        class="{c.bg} w-7 h-7 rounded-full transition-transform
               {color === c.name ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110' : ''}"
        on:click={() => color = c.name}
        aria-label={c.name}
      ></button>
    {/each}
  </div>

  <button
    on:click={save}
    class="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
  >
    {client ? 'Save' : 'Add Client'}
  </button>
</div>
