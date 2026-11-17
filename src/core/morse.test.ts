import { expect, it } from 'vitest'
import { encodeMorse, MORSE_UA, toBeats } from './morse'
import { UA_ALPHABET } from './quest'

it('encodeMorse', () => {
  expect(encodeMorse('ЛІД')).toEqual(['.-..', '..', '-..'])
  expect(encodeMorse('лід')).toEqual(['.-..', '..', '-..'])
})

it('таблиця покриває всю абетку', () => {
  expect([...UA_ALPHABET].filter(c => !MORSE_UA[c])).toEqual([])
})

it('toBeats', () => {
  const beats = toBeats(['..'], 300)
  expect(beats).toEqual([
    { on: true, ms: 300, letterIndex: 0 }, { on: false, ms: 300, letterIndex: 0 }, { on: true, ms: 300, letterIndex: 0 },
  ])
  expect(toBeats(['.', '-'], 300).map(b => [b.on, b.ms])).toEqual([[true, 300], [false, 1200], [true, 900]])
})
