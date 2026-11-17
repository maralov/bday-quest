// Перемішані індекси літер слова; гарантовано не в початковому порядку (слово має ≥ 2 різні літери).
export function shuffleIndices(word: string, rnd: () => number): number[] {
  const letters = [...word]
  const idx = letters.map((_, i) => i)
  do {
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1))
      ;[idx[i], idx[j]] = [idx[j], idx[i]]
    }
  } while (idx.map(i => letters[i]).join('') === word)
  return idx
}
