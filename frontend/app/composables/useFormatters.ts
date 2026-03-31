export function useFormatters() {
  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  })

  const longDateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  const monthFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  })

  function formatLongDate(value: string | Date) {
    return longDateFormatter.format(new Date(value))
  }

  function formatShortDate(value: string | Date) {
    return dayFormatter.format(new Date(value))
  }

  function formatMonth(value: string | Date) {
    return monthFormatter.format(new Date(value))
  }

  function formatWeight(value: number | string | null | undefined) {
    if (value === null || value === undefined || value === '') {
      return '--'
    }

    return `${Number(value).toFixed(1)} kg`
  }

  function formatVolume(value: number | string | null | undefined) {
    if (value === null || value === undefined || value === '') {
      return '--'
    }

    return `${Math.round(Number(value))} kg`
  }

  return {
    formatLongDate,
    formatShortDate,
    formatMonth,
    formatWeight,
    formatVolume
  }
}
