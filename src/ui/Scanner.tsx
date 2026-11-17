import jsQR from 'jsqr'
import { useEffect, useRef, useState, type FormEvent } from 'react'

// Камера й розпізнавання прямо на сторінці: системна камера iPhone відкрила б QR в іншому браузері,
// а там свій localStorage, і прогрес би загубився.
export function Scanner({ onCode, onClose }: { onCode(text: string): boolean; onClose(): void }) {
  const video = useRef<HTMLVideoElement>(null)
  const [camError, setCamError] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [code, setCode] = useState('')
  const onCodeRef = useRef(onCode)
  onCodeRef.current = onCode

  useEffect(() => {
    let stream: MediaStream | undefined
    let raf = 0
    let last = 0
    let stopped = false
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    const tick = (t: number) => {
      if (stopped) return
      raf = requestAnimationFrame(tick)
      const v = video.current
      if (!v || !ctx || v.readyState < 2 || t - last < 150) return
      last = t
      const scale = Math.min(1, 480 / v.videoWidth)
      canvas.width = Math.round(v.videoWidth * scale)
      canvas.height = Math.round(v.videoHeight * scale)
      ctx.drawImage(v, 0, 0, canvas.width, canvas.height)
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const qr = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' })
      if (!qr?.data) return
      const ok = onCodeRef.current(qr.data)
      setWrong(!ok)
      if (ok) stopped = true // інакше наступний кадр той самий QR зарахує як «уже зловлено»
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError(true)
      return
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(s => {
        if (stopped) return s.getTracks().forEach(tr => tr.stop())
        stream = s
        if (video.current) {
          video.current.srcObject = s
          void video.current.play().catch(() => {})
        }
        raf = requestAnimationFrame(tick)
      })
      .catch(() => setCamError(true))

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      stream?.getTracks().forEach(tr => tr.stop())
    }
  }, [])

  function submit(e: FormEvent) {
    e.preventDefault()
    setWrong(!onCode(code))
  }

  return (
    <section className="scanner">
      {camError ? (
        <p>Камера недоступна. Введи код з картки.</p>
      ) : (
        <div className="scanner-view">
          <video ref={video} playsInline muted autoPlay />
          <div className="scanner-frame" aria-hidden />
        </div>
      )}
      {wrong && <p role="alert" className="scanner-wrong">Це не сигнал квесту</p>}
      <form className="scanner-code" onSubmit={submit}>
        <label htmlFor="scanner-code">Або введи код з картки</label>
        <input
          id="scanner-code"
          value={code}
          onChange={e => setCode(e.target.value)}
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button type="submit">Ввести</button>
      </form>
      <button onClick={onClose}>Закрити</button>
    </section>
  )
}
