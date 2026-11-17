import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import './safe-finale.css'

export function Finale({ title, giftPlace }: { title: string; giftPlace: string }) {
  useEffect(() => {
    // confetti сам не стріляє за prefers-reduced-motion завдяки disableForReducedMotion.
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, disableForReducedMotion: true })
  }, [])

  return (
    <div className="finale">
      <h1 className="finale-title">{title}</h1>
      <p>Твій подарунок чекає тут:</p>
      <p className="finale-place">{giftPlace}</p>
    </div>
  )
}
