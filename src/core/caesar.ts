import { UA_ALPHABET } from './quest'

export function shiftText(text: string, shift: number): string {
  const n = UA_ALPHABET.length
  return [...text.toUpperCase()]
    .map(c => {
      const i = UA_ALPHABET.indexOf(c)
      return i < 0 ? c : UA_ALPHABET[(((i + shift) % n) + n) % n]
    })
    .join('')
}
