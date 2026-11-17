import { describe, expect, it } from 'vitest'
import { decodeB64Utf8, normalizeAnswer, sha256Hex } from './hash'

describe('hash', () => {
  it('normalizeAnswer', () => {
    expect(normalizeAnswer('  диво ')).toBe('ДИВО')
    expect(normalizeAnswer('ДИВO')).toBe('ДИВО') // латинська O
    expect(normalizeAnswer('ДИBО')).toBe('ДИВО') // латинська B
    expect(normalizeAnswer('д и в о')).toBe('ДИВО')
  })
  it('sha256Hex', async () => {
    expect(await sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  })
  it('decodeB64Utf8', () => {
    expect(decodeB64Utf8('0KPQutGA')).toBe('Укр')
  })
})
