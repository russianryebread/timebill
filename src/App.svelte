<script>
  import AppShell from './components/layout/AppShell.svelte'
  import TimerScreen from './components/timer/TimerScreen.svelte'
  import ReportsScreen from './components/reports/ReportsScreen.svelte'
  import InvoiceModal from './components/reports/InvoiceModal.svelte'
  import { view, invoiceClientId } from './store/index.js'
</script>

<AppShell>
  {#if $view === 'timer'}
    <TimerScreen />
  {:else}
    <ReportsScreen />
  {/if}
</AppShell>

{#if $invoiceClientId}
  <InvoiceModal />
{/if}
