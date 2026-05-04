<script>
  import TimerList from './TimerList.svelte'
  import NewTimerFAB from './NewTimerFAB.svelte'
  import { activeTimers, entries, projects } from '../../store/index.js'
  import { Timer } from 'lucide-svelte'
</script>

<div class="px-4 py-4 pb-24 max-w-2xl mx-auto">
  {#if $activeTimers.length === 0 && $entries.length === 0}
    <!-- Empty state -->
    <div class="flex flex-col items-center justify-center min-h-[60dvh] text-center gap-4">
      <div class="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
        <Timer size={28} class="text-teal-500"/>
      </div>
      <div>
        <p class="text-slate-300 font-medium">No timers yet</p>
        <p class="text-sm text-slate-500 mt-1">
          {#if $projects.length === 0}
            Open Settings to add a client and project first.
          {:else}
            Tap + to start tracking time.
          {/if}
        </p>
      </div>
    </div>
  {:else}
    <TimerList />
  {/if}
</div>

<NewTimerFAB />
