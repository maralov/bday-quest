import { useEffect, useRef, useState } from 'react'
import type { RadioPuzzle } from '../core/quest'
import { clarity, garble } from './radioMath'
import './dial.css'

function drawNoise(canvas: HTMLCanvasElement | null) {
  const ctx = canvas?.getContext('2d') // null у jsdom
  if (!ctx) return
  const img = ctx.createImageData(ctx.canvas.width, ctx.canvas.height)
  for (let i = 0; i < img.data.length; i += 4) {
    img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.random() * 255
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
}

export default function Radio({ data }: { data: RadioPuzzle }) {
  const [freq, setFreq] = useState(data.min)
  const [, setTick] = useState(0)
  const canvas = useRef<HTMLCanvasElement>(null)
  const c = clarity(freq, data.target)

  useEffect(() => {
    drawNoise(canvas.current)
    const id = setInterval(() => {
      drawNoise(canvas.current)
      setTick(t => t + 1) // перемішує завади в тексті
    }, 200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="dial-puzzle">
      <div className="dial-value">{freq.toFixed(1)} FM</div>
      <input
        className="dial"
        type="range"
        aria-label="Частота"
        min={data.min}
        max={data.max}
        step={0.1}
        value={freq}
        onChange={e => setFreq(Number(e.target.value))}
      />
      <div className="radio-screen">
        <p className="dial-text">{garble(data.text, c, Math.random)}</p>
        <canvas ref={canvas} width={96} height={32} style={{ opacity: 1 - c }} aria-hidden="true" />
      </div>
    </div>
  )
}
