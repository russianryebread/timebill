<script>
  import DuckbillLogo from '../logo/DuckbillLogo.svelte'
  import { view, drawerOpen } from '../../store/index.js'
  import { Menu, X, BarChart2, Timer } from 'lucide-svelte'
</script>

<nav class="fixed top-0 inset-x-0 z-30 h-14 bg-teal-700 flex items-center px-4 gap-3 shadow-lg">
  <!-- Logo + name -->
  <button
    class="flex items-center gap-2 mr-auto"
    on:click={() => view.set('timer')}
  >
    <DuckbillLogo size={28} />
    <span class="font-semibold text-white tracking-wide text-lg leading-none">TimeBill</span>
  </button>

  <!-- View tabs -->
  <div class="flex items-center gap-1 bg-teal-800/60 rounded-lg p-1">
    <button
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
        {$view === 'timer' ? 'bg-white text-teal-700' : 'text-teal-100 hover:text-white'}"
      on:click={() => view.set('timer')}
    >
      <Timer size={14} />
      <span>Timers</span>
    </button>
    <button
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
        {$view === 'reports' ? 'bg-white text-teal-700' : 'text-teal-100 hover:text-white'}"
      on:click={() => view.set('reports')}
    >
      <BarChart2 size={14} />
      <span>Reports</span>
    </button>
  </div>

  <!-- Hamburger -->
  <button
    class="ml-1 p-2 rounded-lg text-teal-100 hover:text-white hover:bg-teal-600 transition-colors"
    on:click={() => drawerOpen.update(v => !v)}
    aria-label="Settings"
  >
    {#if $drawerOpen}
      <X size={20} />
    {:else}
      <Menu size={20} />
    {/if}
  </button>
</nav>

<!-- Spacer so content doesn't hide under fixed nav -->
<div class="h-14"></div>
