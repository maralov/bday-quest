import { useEffect, useState } from 'react'
import { unlockedHints } from '../core/hints'

export function Hints({ hints, delaysSec, startedAt }: { hints: [string, string]; delaysSec: [number, number]; startedAt: number }) {
  const [now, setNow] = useState(Date.now)
  // Скільки підказок розкрито кнопкою; скидається, коли почався новий етап (інший startedAt).
  const [seen, setSeen] = useState({ at: startedAt, n: 0 })
  const shown = seen.at === startedAt ? seen.n : 0

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const ready = shown < unlockedHints(startedAt, now, delaysSec)
  const wait = shown < 2 ? Math.min(delaysSec[shown], Math.ceil(delaysSec[shown] - (now - startedAt) / 1000)) : 0

  return (
    <section className="hints">
      {shown < 2 && (
        <button disabled={!ready} onClick={() => setSeen({ at: startedAt, n: shown + 1 })}>
          {ready ? 'Підказка' : `Підказка через ${wait} с`}
        </button>
      )}
      {shown > 0 && (
        <ol aria-live="polite">
          {hints.slice(0, shown).map((h) => <li key={h}>{h}</li>)}
        </ol>
      )}
    </section>
  )
}
