const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatCurrency = (value: number): string =>
  currencyFormatter.format(value)

export const formatPercent = (value: number, decimals = 1): string =>
  `${value.toFixed(decimals)}%`
