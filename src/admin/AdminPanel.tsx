import QRCode from 'qrcode'
import { useEffect, useState, type FormEvent } from 'react'
import { decodeB64Utf8, sha256Hex } from '../core/hash'
import { FINAL_STAGE, useProgress } from '../core/progress'
import { quest, type Puzzle } from '../core/quest'
import './admin.css'

export function AdminPanel() {
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState(false)

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = new FormData(e.currentTarget).get('password') as string
    const ok = (await sha256Hex(value)) === quest.adminPasswordHash
    setAuthed(ok)
    setError(!ok)
  }

  if (!authed) {
    return (
      <form className="admin admin-login" onSubmit={login}>
        <label>
          Пароль
          <input name="password" type="password" autoComplete="current-password" autoFocus />
        </label>
        <button>Увійти</button>
        {error && <p role="alert">Невірний пароль</p>}
      </form>
    )
  }
  return <Panel />
}

const answer = (p: Puzzle) =>
  p.type === 'morse' ? p.word : p.type === 'mirror' ? p.text : p.type === 'radio' ? String(p.target) : p.plain

function Panel() {
  const { stage, setStage, reset } = useProgress()
  const base = location.origin + location.pathname
  const cards = [
    { title: 'СТАРТ', url: base, note: 'Старт: дати в руки' },
    ...quest.levels.map((l, i) => ({ title: 'Сигнал', url: `${base}?k=${l.token}`, note: `QR ${i + 1}: ${l.hideAt}` })),
  ]
  const [qr, setQr] = useState<string[]>([])

  useEffect(() => {
    Promise.all(cards.map(c => QRCode.toDataURL(c.url, { errorCorrectionLevel: 'M', width: 400 }))).then(setQr)
  }, []) // адреса сторінки не змінюється

  return (
    <main className="admin">
      <h1>Батьківська панель</h1>
      {['localhost', '127.0.0.1'].includes(location.hostname) && (
        <p className="admin-warn" role="alert">QR ведуть на localhost. Друкуй із задеплоєного сайту</p>
      )}

      <section>
        <h2>Прогрес</h2>
        <p>Поточний етап: {stage}</p>
        <div className="admin-row">
          {Array.from({ length: FINAL_STAGE + 1 }, (_, n) => (
            <button key={n} aria-pressed={n === stage} onClick={() => setStage(n)}>{n}</button>
          ))}
        </div>
        <button onClick={reset}>Скинути прогрес</button>
      </section>

      <section>
        <h2>Проходження</h2>
        <ol>
          {quest.levels.map((l, i) => (
            <li key={i}>
              {l.puzzle.type}: <b>{answer(l.puzzle)}</b>, літера {l.letter}. Сховати: {l.hideAt}
            </li>
          ))}
        </ol>
        <p>Схованка подарунка: <b>{decodeB64Utf8(quest.finale.giftPlaceB64)}</b></p>
      </section>

      <section>
        <h2>QR-коди</h2>
        <button onClick={() => window.print()}>Друкувати</button>
        <div className="admin-cards">
          {cards.map((c, i) => (
            <figure key={i} className="admin-card">
              <figcaption>{c.title}</figcaption>
              {qr[i] && <img src={qr[i]} alt={c.title} />}
              <hr />
              <small>{c.note}</small>
            </figure>
          ))}
        </div>
      </section>
    </main>
  )
}
