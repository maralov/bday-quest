import { afterEach, describe, expect, it, vi } from 'vitest'
import { applyToken, collectedLetters, loadProgress, saveProgress, STORAGE_KEY, tokenFromText } from './progress'
import { quest } from './quest'

const t = (n: number) => quest.levels[n - 1].token

describe('applyToken', () => {
  it('ловить сигнал лише на своєму етапі', () => {
    expect(applyToken(1, t(1), quest)).toEqual({ kind: 'caught', level: 1, nextStage: 2 })
    expect(applyToken(4, t(4), quest)).toEqual({ kind: 'caught', level: 4, nextStage: 5 })
  })
  it('повторний скан не просуває прогрес', () => {
    expect(applyToken(2, t(1), quest)).toEqual({ kind: 'already' })
    expect(applyToken(6, t(4), quest)).toEqual({ kind: 'already' })
  })
  it('скан наперед', () => {
    expect(applyToken(1, t(3), quest)).toEqual({ kind: 'tooEarly' })
    expect(applyToken(0, t(1), quest)).toEqual({ kind: 'tooEarly' })
  })
  it('невідомий токен', () => {
    expect(applyToken(2, 'zzzzzzzz', quest)).toEqual({ kind: 'unknown' })
  })
})

describe('collectedLetters', () => {
  it('літери пройдених рівнів', () => {
    expect(collectedLetters(0, quest)).toEqual([])
    expect(collectedLetters(3, quest)).toEqual(['В', 'О'])
    expect(collectedLetters(6, quest)).toEqual(['В', 'О', 'И', 'Д'])
  })
})

describe('loadProgress / saveProgress', () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('порожній storage -> stage 0', () => {
    expect(loadProgress().stage).toBe(0)
  })
  it('сміття -> stage 0', () => {
    localStorage.setItem(STORAGE_KEY, 'not json')
    expect(loadProgress().stage).toBe(0)
    localStorage.setItem(STORAGE_KEY, '{"stage":99}')
    expect(loadProgress().stage).toBe(0)
  })
  it('getItem кидає -> stage 0', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    expect(loadProgress().stage).toBe(0)
  })
  it('save + load повертає те саме', () => {
    saveProgress({ stage: 3, stageStartedAt: 12345 })
    expect(loadProgress()).toEqual({ stage: 3, stageStartedAt: 12345 })
  })
})

describe('tokenFromText', () => {
  it('дістає токен з адреси QR або з введеного коду', () => {
    expect(tokenFromText('https://maralov.github.io/bday-quest/?k=up0uj3ah')).toBe('up0uj3ah')
    expect(tokenFromText(' UP0U J3AH ')).toBe('up0uj3ah')
    expect(tokenFromText('https://example.com/')).toBe('https://example.com/')
  })
})
