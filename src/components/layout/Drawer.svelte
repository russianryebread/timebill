<script>
  import { drawerOpen } from '../../store/index.js'
  import SettingsPanel from '../settings/SettingsPanel.svelte'
</script>

<!-- Backdrop (mobile only) -->
{#if $drawerOpen}
  <div
    class="fixed inset-0 z-40 bg-black/50 md:hidden"
    on:click={() => drawerOpen.set(false)}
    aria-hidden="true"
  ></div>
{/if}

<!-- Drawer panel -->
<aside
  class="fixed top-14 bottom-0 left-0 z-40 w-72 bg-slate-800 border-r border-slate-700
         transform transition-transform duration-200 ease-in-out overflow-y-auto
         {$drawerOpen ? 'translate-x-0' : '-translate-x-full'}"
>
  <SettingsPanel />
</aside>
