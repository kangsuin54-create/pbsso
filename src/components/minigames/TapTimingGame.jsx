import { useEffect, useRef, useState } from 'react'

// 마커가 좌우로 왕복하다가, 타겟 구간(targetStart~targetEnd %) 안에서 탭하면 성공
export default function TapTimingGame({ config, onSuccess, onFail }) {
  const { cycleMs = 1300, targetStart = 45, targetEnd = 65 } = config
  const [pos, setPos] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    const tick = (now) => {
      if (startRef.current === null) startRef.current = now
      const elapsed = (now - startRef.current) % (cycleMs * 2)
      const phase = elapsed < cycleMs ? elapsed / cycleMs : 2 - elapsed / cycleMs
      setPos(phase * 100)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [cycleMs])

  const handleTap = () => {
    if (pos >= targetStart && pos <= targetEnd) onSuccess()
    else onFail()
  }

  return (
    <div style={{ padding: '8px 4px' }}>
      <div style={{ position: 'relative', height: '28px', background: 'rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `${targetStart}%`, width: `${targetEnd - targetStart}%`,
          background: 'rgba(251,191,36,0.35)',
        }} />
        <div style={{
          position: 'absolute', top: '2px', bottom: '2px', width: '6px', borderRadius: '3px',
          background: '#fbbf24', left: `calc(${pos}% - 3px)`, boxShadow: '0 0 8px #fbbf24',
        }} />
      </div>
      <button onClick={handleTap} style={{
        width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#1a1400',
        fontWeight: 'bold', fontSize: '15px', cursor: 'pointer',
      }}>
        지금 탭! ✨
      </button>
    </div>
  )
}
