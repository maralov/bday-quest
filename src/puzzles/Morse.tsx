import { useEffect, useMemo, useState } from 'react'
import { encodeMorse, MORSE_UA, toBeats } from '../core/morse'
import type { MorsePuzzle } from '../core/quest'
import './Morse.css'

const UNIT_MS = 300
const LOOP_PAUSE_MS = 2500
const pretty = (code: string) => code.replaceAll('.', '·').replaceAll('-', '–')

export default function Morse({ data }: { data: MorsePuzzle }) {
  const beats = useMemo(() => toBeats(encodeMorse(data.word), UNIT_MS), [data.word])
  const letters = data.word.length
  const [step, setStep] = useState(0) // step === beats.length: пауза між повторами
  const [run, setRun] = useState(0)

  useEffect(() => {
    const ms = step < beats.length ? beats[step].ms : LOOP_PAUSE_MS
    const t = setTimeout(() => setStep(s => (s + 1) % (beats.length + 1)), ms)
    return () => clearTimeout(t)
  }, [step, run, beats])

  const beat = beats[step]
  const restart = () => {
    setStep(0)
    setRun(r => r + 1)
  }

  return (
    <div className="morse">
      <div className={beat?.on ? 'morse-lamp on' : 'morse-lamp'} role="img" aria-label="Лампа сигналу" />
      <p className="morse-caption">{data.caption}</p>
      <p className="morse-status" aria-live="polite">
        {beat ? `Літера ${beat.letterIndex + 1} з ${letters}` : 'Пауза, зараз почнеться знову'}
      </p>
      <button className="morse-btn" onClick={restart}>Повторити</button>
      <details className="morse-table" open>
        <summary>Азбука Морзе</summary>
        <dl>
          {Object.entries(MORSE_UA).map(([l, code]) => (
            <div key={l}>
              <dt>{l}</dt>
              <dd>{pretty(code)}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  )
}
