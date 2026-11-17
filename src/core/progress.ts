import { useState } from 'react'
import type { Quest } from './quest'

export const STORAGE_KEY = 'signal.progress'
export const FINAL_STAGE = 6

export type Progress = { stage: number; stageStartedAt: number }
export type ScanResult =
  | { kind: 'caught'; level: number; nextStage: number } // level 1..4
  | { kind: 'already' }
  | { kind: 'tooEarly' }
  | { kind: 'unknown' }

// QR номер n ловиться лише на етапі n.
export function applyToken(stage: number, token: string, quest: Quest): ScanResult {
  const n = quest.levels.findIndex(l => l.token === token) + 1
  if (n === 0) return { kind: 'unknown' }
  if (stage === n) return { kind: 'caught', level: n, nextStage: n + 1 }
  return stage > n ? { kind: 'already' } : { kind: 'tooEarly' }
}

export function loadProgress(): Progress {
  try {
    const p = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (Number.isInteger(p?.stage) && p.stage >= 0 && p.stage <= FINAL_STAGE)
      return { stage: p.stage, stageStartedAt: Number.isFinite(p.stageStartedAt) ? p.stageStartedAt : Date.now() }
  } catch {
    // недоступний storage чи сміття: стартуємо з нуля
  }
  return { stage: 0, stageStartedAt: Date.now() }
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
  } catch {
    // shortcut: без storage прогрес живе лише до оновлення сторінки
  }
}

export function collectedLetters(stage: number, quest: Quest): string[] {
  return quest.levels.slice(0, Math.max(0, Math.min(stage - 1, 4))).map(l => l.letter)
}

export function useProgress() {
  const [p, setP] = useState(loadProgress)
  const setStage = (stage: number) => {
    const next = { stage, stageStartedAt: Date.now() }
    saveProgress(next)
    setP(next)
  }
  return { ...p, setStage, reset: () => setStage(0) }
}
