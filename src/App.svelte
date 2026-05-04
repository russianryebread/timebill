<script>
  import AppShell from './components/layout/AppShell.svelte'
  import TimerScreen from './components/timer/TimerScreen.svelte'
  import ReportsScreen from './components/reports/ReportsScreen.svelte'
  import { view } from './store/index.js'
</script>

<AppShell>
  {#if $view === 'timer'}
    <TimerScreen />
  {:else}
    <ReportsScreen />
  {/if}
</AppShell>
