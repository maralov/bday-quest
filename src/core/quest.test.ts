import { describe, expect, it } from 'vitest'
import raw from '../quest.json'
import { validateQuest } from './quest'

const valid = () => structuredClone(raw) as any

describe('validateQuest', () => {
  it('приймає коректний квест', () => {
    expect(() => validateQuest(valid())).not.toThrow()
  })
  it('рівно 4 рівні', () => {
    const q = valid()
    expect(() => validateQuest({ ...q, levels: q.levels.slice(0, 3) })).toThrow(/4/)
  })
  it('унікальні токени', () => {
    const q = valid()
    q.levels[1].token = q.levels[0].token
    expect(() => validateQuest(q)).toThrow(/токен/i)
  })
  it('слово для морзянки', () => {
    const q = valid()
    q.levels[0].puzzle.word = 'ХОЛОД'
    expect(() => validateQuest(q)).toThrow(/морз/i)
    q.levels[0].puzzle.word = 'LID'
    expect(() => validateQuest(q)).toThrow(/морз/i)
  })
  it('радіо', () => {
    const q = valid()
    q.levels[2].puzzle.target = 120
    expect(() => validateQuest(q)).toThrow(/радіо/i)
  })
  it('зсув шифру', () => {
    const q = valid()
    q.levels[3].puzzle.shift = 0
    expect(() => validateQuest(q)).toThrow(/зсув/i)
  })
})
