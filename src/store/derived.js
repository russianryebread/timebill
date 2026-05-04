import { derived, get } from 'svelte/store'
import { entries, projects, clients, reportRange } from './index.js'
import { getLocalDateString, formatDate, formatMonthLabel, getCurrentMonthKey } from '../utils/time.js'
import { computeCost } from '../utils/money.js'

function getDateBuckets(range) {
  const buckets = []
  const now = new Date()
  if (range === '7d') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      buckets.push(getLocalDateString(d.getTime()))
    }
  } else if (range === '30d') {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      buckets.push(getLocalDateString(d.getTime()))
    }
  } else {
    // 12mo — bucket by month
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      buckets.push(key)
    }
  }
  return buckets
}

export const dailyBuckets = derived([entries, reportRange], ([$entries, $range]) => {
  const buckets = getDateBuckets($range)
  const isMonthly = $range === '12mo'

  const totals = {}
  for (const b of buckets) totals[b] = 0

  for (const e of $entries) {
    if (isMonthly) {
      const key = e.date.slice(0, 7)
      if (key in totals) totals[key] += e.durationSeconds
    } else {
      if (e.date in totals) totals[e.date] += e.durationSeconds
    }
  }

  return buckets.map(b => ({
    label: isMonthly ? formatMonthLabel(b + '-01') : formatDate(b),
    hours: totals[b] / 3600,
  }))
})

export const projectTotals = derived([entries, projects, clients], ([$entries, $projects, $clients]) => {
  const map = {}
  for (const e of $entries) {
    if (!map[e.projectId]) map[e.projectId] = 0
    map[e.projectId] += e.durationSeconds
  }
  return $projects
    .filter(p => !p.archived)
    .map(p => {
      const client = $clients.find(c => c.id === p.clientId)
      const seconds = map[p.id] || 0
      return {
        project: p,
        client,
        seconds,
        cost: computeCost(seconds, p.hourlyRate || 0),
      }
    })
    .filter(r => r.seconds > 0)
    .sort((a, b) => b.seconds - a.seconds)
})

export const clientTotals = derived([entries, projects, clients], ([$entries, $projects, $clients]) => {
  const map = {}
  for (const e of $entries) {
    if (!map[e.clientId]) map[e.clientId] = { seconds: 0, cost: 0 }
    const proj = $projects.find(p => p.id === e.projectId)
    map[e.clientId].seconds += e.durationSeconds
    map[e.clientId].cost += computeCost(e.durationSeconds, proj?.hourlyRate || 0)
  }
  return $clients
    .map(c => ({
      client: c,
      seconds: map[c.id]?.seconds || 0,
      cost: map[c.id]?.cost || 0,
    }))
    .filter(r => r.seconds > 0)
    .sort((a, b) => b.seconds - a.seconds)
})

export const budgetProgress = derived([entries, projects], ([$entries, $projects]) => {
  const monthKey = getCurrentMonthKey()
  const monthEntries = $entries.filter(e => e.date.slice(0, 7) === monthKey)

  const map = {}
  for (const e of monthEntries) {
    if (!map[e.projectId]) map[e.projectId] = 0
    map[e.projectId] += e.durationSeconds
  }

  return $projects
    .filter(p => !p.archived && p.monthlyHourBudget)
    .map(p => {
      const usedSeconds = map[p.id] || 0
      const budgetSeconds = (p.monthlyHourBudget || 0) * 3600
      const pct = budgetSeconds > 0 ? (usedSeconds / budgetSeconds) * 100 : 0
      return { project: p, usedSeconds, budgetSeconds, pct }
    })
})
