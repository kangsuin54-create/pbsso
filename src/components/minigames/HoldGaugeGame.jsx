import { useEffect, useRef, useState } from 'react'

// 누르고 있는 동안 게이지가 채워짐, 다 채우면 성공. 떼면 천천히 감소.
export default function HoldGaugeGame({ config, onSuccess, onFail }) {
  const { holdMs = 2000, decayRate = 0.5 } = config
  const [progress, setProgress] = useState(0)
  const holdingRef = useRef(false)
  const rafRef = useRef(null)
  const lastRef = useRef(null)
  const failedRef = useRef(false)

  useEffect(() => {
    const tick = (now) => {
      if (lastRef.current === null) lastRef.current = now
      const dt = now - lastRef.current
      lastRef.current = now
      setProgress(p => {
        let next = holdingRef.current ? p + (dt / holdMs) * 100 : p - dt * decayRate * 0.05
        next = Math.max(0, Math.min(100, next))
        if (next >= 100 && !failedRef.current) {
          failedRef.current = true
          onSuccess()
        }
        return next
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdMs, decayRate])

  const startHold = () => { holdingRef.current = true }
  const stopHold = () => {
    holdingRef.current = false
    if (progress < 15) onFail()
  }

  return (
    <div style={{ padding: '8px 4px' }}>
      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', height: '20px', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: 'linear-gradient(90deg, #34d399, #fbbf24)',
          transition: 'width 0.05s linear',
        }} />
      </div>
      <button
        onPointerDown={startHold}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        style={{
          width: '100%', padding: '18px', borderRadius: '14px', border: 'none',
          background: 'linear-gradient(135deg, #34d399, #059669)', color: 'white',
          fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', userSelect: 'none', touchAction: 'none',
        }}
      >
        꾹 누르고 있어요... 🤲
      </button>
    </div>
  )
}
