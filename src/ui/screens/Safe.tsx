import { useState, type FormEvent } from 'react'
import { normalizeAnswer, sha256Hex } from '../../core/hash'
import './safe-finale.css'

export async function checkSafe(value: string, passwordHash: string): Promise<boolean> {
  return (await sha256Hex(normalizeAnswer(value))) === passwordHash
}

export function Safe({ letters, passwordHash, onOpen }: { letters: string[]; passwordHash: string; onOpen(): void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (await checkSafe(value, passwordHash)) onOpen()
    else setError(true)
  }

  return (
    <form className="safe" onSubmit={submit}>
      <div className="safe-tiles">
        {letters.map((l, i) => <span key={i} className="safe-tile">{l}</span>)}
      </div>
      <label htmlFor="safe-input">Склади слово з чотирьох сигналів</label>
      <input
        id="safe-input"
        className="safe-input"
        value={value}
        onChange={e => setValue(e.target.value.replace(/\s/g, ''))} // пробіли не з’їдають maxLength
        maxLength={4}
        autoCapitalize="characters"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-invalid={error}
        aria-describedby={error ? 'safe-error' : undefined}
      />
      <button type="submit" className="safe-btn">Відкрити</button>
      {error && <p id="safe-error" role="alert" className="safe-error">Сигнал не розпізнано</p>}
    </form>
  )
}
