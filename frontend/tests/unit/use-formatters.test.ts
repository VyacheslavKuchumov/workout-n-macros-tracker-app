import { describe, expect, it } from 'vitest'

import { useFormatters } from '../../app/composables/useFormatters'

describe('useFormatters', () => {
  it('formats weights and volume for display', () => {
    const { formatWeight, formatVolume } = useFormatters()

    expect(formatWeight('82.45')).toBe('82.5 kg')
    expect(formatVolume(1240.4)).toBe('1240 kg')
  })

  it('formats dates for labels', () => {
    const { formatShortDate } = useFormatters()

    expect(formatShortDate('2026-03-31')).toBe('Mar 31')
  })
})
