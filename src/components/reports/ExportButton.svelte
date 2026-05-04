<script>
  import { entries, projects, clients } from '../../store/index.js'
  import { formatHours, getLocalDateString } from '../../utils/time.js'
  import { computeCost } from '../../utils/money.js'
  import { Download } from 'lucide-svelte'

  function exportCSV() {
    const projectMap = Object.fromEntries($projects.map(p => [p.id, p]))
    const clientMap  = Object.fromEntries($clients.map(c => [c.id, c]))

    const header = ['Date', 'Client', 'Project', 'Duration (h)', 'Cost (USD)', 'Notes']
    const rows = $entries.map(e => {
      const proj = projectMap[e.projectId]
      const cli  = clientMap[e.clientId]
      const cost = computeCost(e.durationSeconds, proj?.hourlyRate ?? 0)
      return [
        e.date,
        cli?.name ?? '',
        proj?.name ?? '',
        (e.durationSeconds / 3600).toFixed(4),
        cost.toFixed(2),
        `"${(e.notes || '').replace(/"/g, '""')}"`,
      ]
    })

    const csv = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `timebill-export-${getLocalDateString(Date.now())}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
</script>

<button
  on:click={exportCSV}
  disabled={$entries.length === 0}
  class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-600
         text-sm font-medium text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800
         disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
>
  <Download size={15}/>
  Export CSV ({$entries.length} entries)
</button>
