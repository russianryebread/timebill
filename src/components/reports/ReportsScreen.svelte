<script>
  import DailyBarChart from './DailyBarChart.svelte'
  import ProjectBreakdown from './ProjectBreakdown.svelte'
  import ClientBreakdown from './ClientBreakdown.svelte'
  import BudgetProgress from './BudgetProgress.svelte'
  import ExportButton from './ExportButton.svelte'

  // Mobile tab state
  let mobileTab = 'chart'
  const TABS = [
    { id: 'chart',    label: 'Chart' },
    { id: 'projects', label: 'Projects' },
    { id: 'clients',  label: 'Clients' },
    { id: 'budgets',  label: 'Budgets' },
  ]
</script>

<!-- ── Mobile layout ─────────────────────────────────────────────────── -->
<div class="md:hidden px-4 py-4 pb-8 space-y-4">
  <!-- Tab pills -->
  <div class="flex gap-1 bg-slate-800 rounded-xl p-1 overflow-x-auto">
    {#each TABS as tab}
      <button
        class="flex-1 whitespace-nowrap px-3 py-2 rounded-lg text-xs font-medium transition-colors
               {mobileTab === tab.id ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}"
        on:click={() => mobileTab = tab.id}
      >{tab.label}</button>
    {/each}
  </div>

  {#if mobileTab === 'chart'}
    <DailyBarChart />
  {:else if mobileTab === 'projects'}
    <ProjectBreakdown />
  {:else if mobileTab === 'clients'}
    <ClientBreakdown />
  {:else if mobileTab === 'budgets'}
    <BudgetProgress />
  {/if}

  <ExportButton />
</div>

<!-- ── Desktop layout ────────────────────────────────────────────────── -->
<div class="hidden md:grid grid-cols-2 gap-5 px-6 py-5 max-w-6xl mx-auto">
  <!-- Left column: chart takes full height -->
  <div class="space-y-4">
    <DailyBarChart />
    <ClientBreakdown />
  </div>

  <!-- Right column: tables + budgets + export -->
  <div class="space-y-4">
    <ProjectBreakdown />
    <BudgetProgress />
    <ExportButton />
  </div>
</div>
