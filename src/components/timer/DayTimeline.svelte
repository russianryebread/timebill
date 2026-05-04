<script>
  import { CLIENT_COLOR_MAP } from '../../utils/colors.js'

  export let dayEntries = []
  export let clientsMap = new Map()
  export let activeTimers = []
  export let now = Date.now()

  const MIN_WIDTH_PCT = 1.5
  const HR_MS = 3_600_000

  $: segments = [
    ...dayEntries
      .filter(e => e.startedAt && e.stoppedAt && e.stoppedAt > e.startedAt)
      .map(e => ({ start: e.startedAt, end: e.stoppedAt, clientId: e.clientId, active: false })),
    ...activeTimers
      .filter(t => t.startedAt)
      .map(t => ({ start: t.startedAt, end: now, clientId: t.clientId, active: true })),
  ]

  $: windowStart = segments.length
    ? Math.floor(Math.min(...segments.map(s => s.start)) / HR_MS) * HR_MS
    : 0

  $: windowEnd = segments.length
    ? Math.ceil(Math.max(...segments.map(s => s.end)) / HR_MS) * HR_MS
    : 0

  $: windowMs = Math.max(windowEnd - windowStart, HR_MS)

  $: blocks = segments.map(seg => {
    const rawWidth = ((seg.end - seg.start) / windowMs) * 100
    return {
      left:     ((seg.start - windowStart) / windowMs) * 100,
      width:    Math.max(rawWidth, MIN_WIDTH_PCT),
      color:    CLIENT_COLOR_MAP[clientsMap.get(seg.clientId)?.color] ?? 'bg-slate-500',
      active:   seg.active,
      label:    clientsMap.get(seg.clientId)?.name ?? '',
    }
  })

  $: hourTicks = (() => {
    if (!segments.length) return []
    const ticks = []
    const first = Math.ceil(windowStart / HR_MS) * HR_MS
    for (let t = first; t < windowEnd; t += HR_MS) {
      ticks.push(((t - windowStart) / windowMs) * 100)
    }
    return ticks.length >= 2 && ticks.length <= 12 ? ticks : []
  })()
</script>

{#if segments.length > 0}
  <div class="relative h-2 rounded-full bg-slate-700/40 overflow-hidden mx-1 mb-2">
    {#each hourTicks as pct}
      <div class="absolute top-0 h-full w-px bg-slate-500/30" style="left:{pct}%"></div>
    {/each}
    {#each blocks as block}
      <div
        class="absolute top-0 h-full rounded-sm {block.color}
               {block.active ? 'opacity-70 animate-pulse' : 'opacity-85'}"
        style="left:{block.left}%;width:{block.width}%"
        title={block.label}
      ></div>
    {/each}
  </div>
{/if}
