import { useEffect, useState, type ComponentType, type ReactNode } from 'react'
import { decodeB64Utf8 } from './core/hash'
import { applyToken, collectedLetters, FINAL_STAGE, useProgress, type ScanResult } from './core/progress'
import { quest, type Puzzle } from './core/quest'
import { puzzles } from './puzzles'

export default function App() {
  return new URLSearchParams(location.search).has('admin') ? <AdminPanel /> : <Quest />
}

function Quest() {
  const { stage, stageStartedAt, setStage } = useProgress()
  const [scan, setScan] = useState<ScanResult | null>(null)
  const total = quest.levels.length

  useEffect(() => {
    const url = new URL(location.href)
    const k = url.searchParams.get('k')
    if (k === null) return
    const r = applyToken(stage, k, quest)
    if (r.kind === 'caught') setStage(r.nextStage)
    setScan(r)
    // Прибираємо k, щоб оновлення сторінки не сканувало вдруге.
    url.searchParams.delete('k')
    history.replaceState(null, '', url)
  }, []) // лише при монтуванні

  let screen: ReactNode
  if (scan?.kind === 'caught') {
    screen = <Caught letter={quest.levels[scan.level - 1].letter} count={scan.level} total={total} onContinue={() => setScan(null)} />
  } else if (scan?.kind === 'tooEarly') {
    screen = <TooEarly onBack={() => setScan(null)} />
  } else if (stage === 0) {
    screen = <Intro title={quest.title} text={quest.intro} onStart={() => setStage(1)} />
  } else if (stage <= total) {
    const level = quest.levels[stage - 1]
    const P = puzzles[level.puzzle.type] as ComponentType<{ data: Puzzle }>
    screen = (
      <div key={stage}>
        <P data={level.puzzle} />
        <Hints hints={level.hints} delaysSec={quest.hintDelaysSec} startedAt={stageStartedAt} />
      </div>
    )
  } else if (stage < FINAL_STAGE) {
    screen = <Safe letters={collectedLetters(stage, quest)} passwordHash={quest.safe.passwordHash} onOpen={() => setStage(FINAL_STAGE)} />
  } else {
    screen = <Finale title={quest.finale.title} giftPlace={decodeB64Utf8(quest.finale.giftPlaceB64)} />
  }

  return (
    <Shell letters={collectedLetters(stage, quest)} total={total}>
      {scan?.kind === 'already' && <p role="status">Цей сигнал уже зловлено</p>}
      {screen}
    </Shell>
  )
}

// Тимчасові заглушки екранів до Task 2, 7, 8; у Task 9 замінити імпортами.
function Shell(p: { letters: string[]; total: number; children: ReactNode }) {
  return <main><p>Сигнали: {p.letters.join(' ')} ({p.letters.length}/{p.total})</p>{p.children}</main>
}
function Hints(p: { hints: [string, string]; delaysSec: [number, number]; startedAt: number }) {
  return <details><summary>Підказка</summary>{p.hints.join(' / ')} ({p.delaysSec.join(', ')} с від {p.startedAt})</details>
}
function Intro(p: { title: string; text: string; onStart(): void }) {
  return <section><h1>{p.title}</h1><p>{p.text}</p><button onClick={p.onStart}>Відповісти</button></section>
}
function Caught(p: { letter: string; count: number; total: number; onContinue(): void }) {
  return <section><h1>Сигнал зловлено</h1><p>{p.letter}</p><p>Сигналів: {p.count} з {p.total}</p><button onClick={p.onContinue}>Далі</button></section>
}
function TooEarly(p: { onBack(): void }) {
  return <section><p>Цей сигнал ще зашифровано. Спершу розгадай поточне завдання</p><button onClick={p.onBack}>Назад</button></section>
}
function Safe(p: { letters: string[]; passwordHash: string; onOpen(): void }) {
  return <section><p>{p.letters.join(' ')}</p><button onClick={p.onOpen}>Відкрити</button></section>
}
function Finale(p: { title: string; giftPlace: string }) {
  return <section><h1>{p.title}</h1><p>Твій подарунок чекає тут:</p><p>{p.giftPlace}</p></section>
}
function AdminPanel() {
  return <main>Батьківська панель (Task 8)</main>
}
