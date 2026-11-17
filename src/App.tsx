import { useEffect, useState, type ComponentType } from 'react'
import { AdminPanel } from './admin/AdminPanel'
import { decodeB64Utf8 } from './core/hash'
import { applyToken, collectedLetters, FINAL_STAGE, tokenFromText, useProgress, type ScanResult } from './core/progress'
import { quest, type Puzzle } from './core/quest'
import { puzzles } from './puzzles'
import { Hints } from './ui/Hints'
import { Scanner } from './ui/Scanner'
import { Shell } from './ui/Shell'
import { Caught } from './ui/screens/Caught'
import { Finale } from './ui/screens/Finale'
import { Intro } from './ui/screens/Intro'
import { Safe } from './ui/screens/Safe'
import { TooEarly } from './ui/screens/TooEarly'

export default function App() {
  return new URLSearchParams(location.search).has('admin') ? <AdminPanel /> : <Quest />
}

function Quest() {
  const { stage, stageStartedAt, setStage } = useProgress()
  const [scan, setScan] = useState<ScanResult | null>(null)
  const [scanning, setScanning] = useState(false)
  const total = quest.levels.length

  // Повертає false для чужого QR чи коду, щоб сканер лишався відкритим.
  function handleToken(token: string): boolean {
    const r = applyToken(stage, token, quest)
    if (r.kind === 'unknown') return false
    if (r.kind === 'caught') setStage(r.nextStage)
    setScan(r)
    setScanning(false)
    return true
  }

  useEffect(() => {
    const url = new URL(location.href)
    const k = url.searchParams.get('k')
    if (k === null) return
    handleToken(k)
    // Прибираємо k, щоб оновлення сторінки не сканувало вдруге.
    url.searchParams.delete('k')
    history.replaceState(null, '', url)
  }, []) // лише при монтуванні

  let screen
  if (scan?.kind === 'caught') {
    screen = <Caught letter={quest.levels[scan.level - 1].letter} count={scan.level} total={total} onContinue={() => setScan(null)} />
  } else if (scan?.kind === 'tooEarly') {
    screen = <TooEarly onBack={() => setScan(null)} />
  } else if (stage === 0) {
    screen = <Intro title={quest.title} text={quest.intro} onStart={() => setStage(1)} />
  } else if (scanning) {
    screen = <Scanner key="scanner" onCode={t => handleToken(tokenFromText(t))} onClose={() => setScanning(false)} />
  } else if (stage <= total) {
    const level = quest.levels[stage - 1]
    const P = puzzles[level.puzzle.type] as ComponentType<{ data: Puzzle }>
    screen = (
      <div key={stage}>
        <P data={level.puzzle} />
        <Hints hints={level.hints} delaysSec={quest.hintDelaysSec} startedAt={stageStartedAt} />
        <button className="scan-open" onClick={() => setScanning(true)}>Зловити сигнал</button>
      </div>
    )
  } else if (stage < FINAL_STAGE) {
    screen = <Safe letters={collectedLetters(stage, quest)} passwordHash={quest.safe.passwordHash} onOpen={() => setStage(FINAL_STAGE)} />
  } else {
    screen = <Finale title={quest.finale.title} giftPlace={decodeB64Utf8(quest.finale.giftPlaceB64)} />
  }

  return (
    <Shell letters={collectedLetters(stage, quest)} total={total}>
      {scan?.kind === 'already' && <p role="status" className="banner">Цей сигнал уже зловлено</p>}
      {screen}
    </Shell>
  )
}
