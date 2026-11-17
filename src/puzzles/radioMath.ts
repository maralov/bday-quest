const NOISE = '▓▒░#%&?'

export function clarity(freq: number, target: number): number {
  const d = Math.round(Math.abs(freq - target) * 1e6) / 1e6 // гасимо похибку float: 101.5 - 101.3 ≠ 0.2
  if (d <= 0.2) return 1
  if (d >= 2) return 0
  return (2 - d) / 1.8
}

export function garble(text: string, clarity: number, rnd: () => number): string {
  return [...text].map(c => (c === ' ' || rnd() < clarity ? c : NOISE[Math.floor(rnd() * NOISE.length)])).join('')
}
