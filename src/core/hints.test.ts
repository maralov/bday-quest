import { expect, test } from 'vitest'
import { unlockedHints } from './hints'

test('підказки відкриваються за реальним часом від startedAt', () => {
  expect(unlockedHints(0, 44_000, [45, 90])).toBe(0)
  expect(unlockedHints(0, 45_000, [45, 90])).toBe(1)
  expect(unlockedHints(0, 90_000, [45, 90])).toBe(2)
  expect(unlockedHints(0, 9_999_000, [45, 90])).toBe(2)
  expect(unlockedHints(100_000, 50_000, [45, 90])).toBe(0) // годинник назад
})
