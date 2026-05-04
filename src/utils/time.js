export function formatDuration(totalSeconds) {
  const s = Math.floor(totalSeconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export function formatHours(totalSeconds) {
  return (totalSeconds / 3600).toFixed(2)
}

export function getLocalDateString(ts) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getCurrentMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function formatDate(dateStr) {
  const [y, m, day] = dateStr.split('-')
  return new Date(Number(y), Number(m) - 1, Number(day)).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric',
  })
}

export function formatMonthLabel(dateStr) {
  const [y, m] = dateStr.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(undefined, {
    month: 'short', year: '2-digit',
  })
}
