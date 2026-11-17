import { expect, it } from 'vitest'
import { shuffleIndices } from './anagram'

it('shuffleIndices перемішує всі літери і не лишає слово як є', () => {
  for (let n = 0; n < 50; n++) {
    const idx = shuffleIndices('МОРОЗИЛКА', Math.random)
    expect([...idx].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
    expect(idx.map(i => 'МОРОЗИЛКА'[i]).join('')).not.toBe('МОРОЗИЛКА')
  }
  // rnd, що «не перемішує», все одно не повертає слово як є
  let k = 0
  const rnd = () => (k++ < 8 ? 0.999 : Math.random())
  expect(shuffleIndices('ЛІД', rnd).map(i => 'ЛІД'[i]).join('')).not.toBe('ЛІД')
})
