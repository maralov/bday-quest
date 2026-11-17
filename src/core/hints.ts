export function unlockedHints(startedAt: number, now: number, delaysSec: [number, number]): 0 | 1 | 2 {
  const sec = (now - startedAt) / 1000
  return sec >= delaysSec[1] ? 2 : sec >= delaysSec[0] ? 1 : 0
}
