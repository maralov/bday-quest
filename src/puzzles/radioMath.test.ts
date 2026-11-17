import { describe, expect, it } from 'vitest'
import { clarity, garble } from './radioMath'

describe('radioMath', () => {
  it('clarity', () => {
    expect(clarity(101.3, 101.3)).toBe(1)
    expect(clarity(101.5, 101.3)).toBe(1)
    expect(clarity(103.3, 101.3)).toBe(0)
    expect(clarity(90, 101.3)).toBe(0)
    expect(clarity(102.4, 101.3)).toBeCloseTo(0.5, 1)
  })

  it('garble', () => {
    expect(garble('АБВ ГД', 1, () => 0.99)).toBe('АБВ ГД')
    expect(garble('АБВ ГД', 0, () => 0)).not.toMatch(/[А-ЯІЇЄҐ]/)
    expect(garble('АБВ ГД', 0, () => 0)[3]).toBe(' ')
  })
})
