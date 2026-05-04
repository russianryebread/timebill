<script>
  import ClientList from './ClientList.svelte'
  import ProjectList from './ProjectList.svelte'
  import { Settings } from 'lucide-svelte'

  let tab = 'clients'
</script>

<div class="flex flex-col h-full">
  <div class="px-4 pt-4 pb-2 border-b border-slate-700 flex items-center gap-2">
    <Settings size={16} class="text-slate-400"/>
    <span class="text-sm font-semibold text-slate-200">Settings</span>
  </div>

  <!-- Tabs -->
  <div class="flex border-b border-slate-700">
    <button
      class="flex-1 py-2.5 text-xs font-medium transition-colors
             {tab === 'clients' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-slate-200'}"
      on:click={() => tab = 'clients'}
    >Clients</button>
    <button
      class="flex-1 py-2.5 text-xs font-medium transition-colors
             {tab === 'projects' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-slate-200'}"
      on:click={() => tab = 'projects'}
    >Projects</button>
  </div>

  <div class="flex-1 overflow-y-auto">
    {#if tab === 'clients'}
      <ClientList />
    {:else}
      <ProjectList />
    {/if}
  </div>
</div>
