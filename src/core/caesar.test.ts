import { describe, expect, it } from 'vitest'
import { shiftText } from './caesar'

describe('shiftText', () => {
  it('зсуває по українській абетці', () => {
    expect(shiftText('А', 3)).toBe('Г')
    expect(shiftText('Я', 1)).toBe('А')
    expect(shiftText('А', -1)).toBe('Я')
    expect(shiftText('ґ ї!', 0)).toBe('Ґ Ї!')
    const plain = 'ПОЛИЦЯ ТВОЇХ ПЕРЕМОГ'
    expect(shiftText(shiftText(plain, 3), -3)).toBe(plain)
    expect(shiftText(plain, 3)).not.toBe(plain)
  })
})
