export function computeCost(durationSeconds, hourlyRate) {
  return (durationSeconds / 3600) * hourlyRate
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}
