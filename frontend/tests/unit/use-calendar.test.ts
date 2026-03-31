import { describe, expect, it } from 'vitest'

import { useCalendar } from '../../app/composables/useCalendar'

describe('useCalendar', () => {
  it('builds a six-week grid', () => {
    const { buildCalendarDays } = useCalendar()
    const days = buildCalendarDays(new Date(2026, 2, 12))

    expect(days).toHaveLength(42)
    expect(days[0]?.iso).toBe('2026-02-23')
    expect(days.at(-1)?.iso).toBe('2026-04-05')
  })

  it('formats month queries for the API', () => {
    const { toMonthQuery } = useCalendar()

    expect(toMonthQuery(new Date('2026-11-01T00:00:00Z'))).toBe('2026-11')
  })
})
