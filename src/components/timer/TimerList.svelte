<script>
  import { onMount, onDestroy } from 'svelte'
  import { activeTimers, entries, clients } from '../../store/index.js'
  import TimerCard from './TimerCard.svelte'
  import RecentEntryRow from './RecentEntryRow.svelte'
  import DayTimeline from './DayTimeline.svelte'
  import { formatDate, getLocalDateString } from '../../utils/time.js'
  import { Clock } from 'lucide-svelte'

  let now = Date.now()
  let interval

  onMount(() => {
    interval = setInterval(() => { now = Date.now() }, 1000)
  })
  onDestroy(() => clearInterval(interval))

  $: clientsMap = new Map($clients.map(c => [c.id, c]))
  $: recentEntries = $entries.filter(e => !e.archived).slice(0, 30)
  $: recentDates = [...new Set(recentEntries.map(e => e.date))].slice(0, 7)
</script>

<div class="space-y-2">
  {#if $activeTimers.length > 0}
    <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 pb-1">Running</p>
    {#each $activeTimers as timer (timer.id)}
      <TimerCard {timer} {now} />
    {/each}
  {/if}

  {#if recentDates.length > 0}
    <div class="{$activeTimers.length > 0 ? 'pt-4' : ''}">
      {#each recentDates as date}
        {@const dayEntries = recentEntries.filter(e => e.date === date)}
        {@const dayActiveTimers = $activeTimers.filter(t => getLocalDateString(t.startedAt) === date)}
        <div class="mb-4">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1 mb-1 flex items-center gap-1.5">
            <Clock size={11}/>
            {formatDate(date)}
          </p>
          <DayTimeline {dayEntries} {clientsMap} {dayActiveTimers} {now} />
          <div class="space-y-0.5">
            {#each dayEntries as entry (entry.id)}
              <RecentEntryRow {entry} />
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
