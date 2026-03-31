export function useCalendar() {
  function startOfMonth(value: Date) {
    return new Date(value.getFullYear(), value.getMonth(), 1)
  }

  function endOfMonth(value: Date) {
    return new Date(value.getFullYear(), value.getMonth() + 1, 0)
  }

  function addMonths(value: Date, amount: number) {
    return new Date(value.getFullYear(), value.getMonth() + amount, 1)
  }

  function toIsoDate(value: Date) {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  function buildCalendarDays(monthDate: Date) {
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)
    const firstWeekday = (monthStart.getDay() + 6) % 7
    const gridStart = new Date(monthStart)
    gridStart.setDate(monthStart.getDate() - firstWeekday)

    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(gridStart)
      day.setDate(gridStart.getDate() + index)

      return {
        date: day,
        iso: toIsoDate(day),
        day: day.getDate(),
        inMonth: day >= monthStart && day <= monthEnd,
        isToday: toIsoDate(day) === toIsoDate(new Date())
      }
    })
  }

  function toMonthQuery(value: Date) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}`
  }

  return {
    addMonths,
    buildCalendarDays,
    startOfMonth,
    toIsoDate,
    toMonthQuery
  }
}
