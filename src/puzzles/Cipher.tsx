import { useState } from 'react'
import { shiftText } from '../core/caesar'
import type { CipherPuzzle } from '../core/quest'
import './dial.css'

export default function Cipher({ data }: { data: CipherPuzzle }) {
  const [key, setKey] = useState(0)
  const cipher = shiftText(data.plain, data.shift)

  return (
    <div className="dial-puzzle">
      <p className="dial-text dial-cipher">{cipher}</p>
      <label htmlFor="cipher-key" className="dial-value">Ключ: {key}</label>
      <input
        id="cipher-key"
        className="dial"
        type="range"
        min={0}
        max={Math.max(10, data.shift)} // щоб більший зсув у quest.json не зробив рівень непрохідним
        step={1}
        value={key}
        onChange={e => setKey(Number(e.target.value))}
      />
      <p className="dial-text">{shiftText(cipher, -key)}</p>
      <p>{data.keyHint}</p>
    </div>
  )
}
