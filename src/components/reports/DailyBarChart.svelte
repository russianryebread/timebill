<script>
  import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
  import { get } from 'svelte/store'
  import { dailyBuckets } from '../../store/derived.js'
  import { reportRange } from '../../store/index.js'

  Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

  /** Svelte action — runs when canvas enters DOM, cleans up when it leaves */
  function chartAction(canvasEl) {
    // Destroy any stale instance on this canvas
    const stale = Chart.getChart(canvasEl)
    if (stale) stale.destroy()

    const buckets = get(dailyBuckets)
    const chart = new Chart(canvasEl, {
      type: 'bar',
      data: {
        labels: buckets.map(b => b.label),
        datasets: [{
          label: 'Hours',
          data: buckets.map(b => b.hours),
          backgroundColor: 'rgba(13,148,136,0.7)',
          borderColor: '#0d9488',
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => `${ctx.parsed.y.toFixed(2)} hrs` } },
        },
        scales: {
          x: { ticks: { color: '#94a3b8', font: { size: 11 }, maxRotation: 45 }, grid: { color: '#1e293b' } },
          y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: '#1e293b' }, beginAtZero: true },
        },
      },
    })

    // Subscribe to store changes and update the chart
    const unsub = dailyBuckets.subscribe(newBuckets => {
      chart.data.labels = newBuckets.map(b => b.label)
      chart.data.datasets[0].data = newBuckets.map(b => b.hours)
      chart.update('none')
    })

    return {
      destroy() {
        unsub()
        chart.destroy()
      }
    }
  }
</script>

<div class="bg-slate-800 rounded-xl border border-slate-700 p-4">
  <div class="flex items-center justify-between mb-3">
    <h3 class="text-sm font-semibold text-slate-200">Hours Logged</h3>
    <div class="flex gap-1 bg-slate-700 rounded-lg p-1">
      {#each [['7d','7 days'],['30d','30 days'],['12mo','12 mo']] as [val, label]}
        <button
          class="px-2.5 py-1 rounded-md text-xs font-medium transition-colors
                 {$reportRange === val ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}"
          on:click={() => reportRange.set(val)}
        >{label}</button>
      {/each}
    </div>
  </div>
  <div class="h-48 md:h-64">
    <canvas use:chartAction></canvas>
  </div>
</div>
