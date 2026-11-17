import { useState } from 'react'
import { shuffleIndices } from '../core/anagram'
import type { AnagramPuzzle } from '../core/quest'
import './Anagram.css'

export default function Anagram({ data }: { data: AnagramPuzzle }) {
  const letters = [...data.word]
  const [order] = useState(() => shuffleIndices(data.word, Math.random))
  const [picked, setPicked] = useState<number[]>([]) // індекси літер у порядку натискання
  const full = picked.length === letters.length
  const solved = full && picked.map(i => letters[i]).join('') === data.word

  return (
    <div className="anagram">
      <p>{data.caption}</p>
      <div className={solved ? 'anagram-slots solved' : 'anagram-slots'} style={{ gridTemplateColumns: `repeat(${letters.length}, 1fr)` }}>
        {letters.map((_, s) => (
          <button
            key={s}
            className="anagram-slot"
            disabled={solved || picked[s] === undefined}
            aria-label={picked[s] === undefined ? 'Порожньо' : `Прибрати ${letters[picked[s]]}`}
            onClick={() => setPicked(p => p.filter((_, k) => k !== s))}
          >
            {picked[s] === undefined ? '' : letters[picked[s]]}
          </button>
        ))}
      </div>
      {solved ? (
        <p className="anagram-ok">Так! Сигнал там. Біжи шукати картку</p>
      ) : (
        <>
          <div className="anagram-tiles">
            {order.map(i => (
              <button key={i} className="anagram-tile" disabled={picked.includes(i)} onClick={() => setPicked(p => (p.includes(i) || p.length === letters.length ? p : [...p, i]))}>
                {letters[i]}
              </button>
            ))}
          </div>
          {full && <p className="anagram-wrong" role="alert">Не те слово. Натисни на літеру, щоб прибрати її</p>}
          <button onClick={() => setPicked([])} disabled={picked.length === 0}>Почати знову</button>
        </>
      )}
    </div>
  )
}
