export const MORSE_UA: Record<string, string> = {
  А: '.-', Б: '-...', В: '.--', Г: '--.', Ґ: '--.', Д: '-..', Е: '.', Є: '..-..', Ж: '...-', З: '--..', И: '-.--',
  І: '..', Ї: '.---.', Й: '.---', К: '-.-', Л: '.-..', М: '--', Н: '-.', О: '---', П: '.--.', Р: '.-.', С: '...',
  Т: '-', У: '..-', Ф: '..-.', Х: '....', Ц: '-.-.', Ч: '---.', Ш: '----', Щ: '--.-', Ь: '-..-', Ю: '..--', Я: '.-.-',
}

export const encodeMorse = (word: string): string[] => [...word.toUpperCase()].map(c => MORSE_UA[c])

export type Beat = { on: boolean; ms: number; letterIndex: number }

// Одиниці: крапка 1, тире 3, пауза в літері 1, між літерами 4.
export function toBeats(codes: string[], unitMs: number): Beat[] {
  const beats: Beat[] = []
  codes.forEach((code, letterIndex) => {
    if (letterIndex > 0) beats.push({ on: false, ms: 4 * unitMs, letterIndex })
    ;[...code].forEach((s, i) => {
      if (i > 0) beats.push({ on: false, ms: unitMs, letterIndex })
      beats.push({ on: true, ms: (s === '-' ? 3 : 1) * unitMs, letterIndex })
    })
  })
  return beats
}
