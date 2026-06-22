import { useEffect, useRef, useState } from 'react'

// beatIntervalMs마다 비트가 울리고, toleranceMs 안에 탭하면 적중. beatCount회 중 hitsNeeded 이상이면 성공.
export default function RhythmTapGame({ config, onSuccess, onFail }) {
  const { beatCount = 5, beatIntervalMs = 900, toleranceMs = 350, hitsNeeded = 4 } = config
  const [beatIdx, setBeatIdx] = useState(0)
  const [pulse, setPulse] = useState(false)
  const [hits, setHits] = useState(0)
  const beatTimeRef = useRef(0)
  const lastHitWindowOpenRef = useRef(false)
  const doneRef = useRef(false)

  useEffect(() => {
    beatTimeRef.current = performance.now()
    const interval = setInterval(() => {
      setBeatIdx(i => {
        const next = i + 1
        if (next > beatCount) {
          clearInterval(interval)
          if (!doneRef.current) {
            doneRef.current = true
            setHits(h => { if (h >= hitsNeeded) onSuccess(); else onFail(); return h })
          }
          return i
        }
        beatTimeRef.current = performance.now()
        lastHitWindowOpenRef.current = true
        setPulse(true)
        setTimeout(() => setPulse(false), 200)
        setTimeout(() => { lastHitWindowOpenRef.current = false }, toleranceMs)
        return next
      })
    }, beatIntervalMs)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTap = () => {
    if (lastHitWindowOpenRef.current) {
      lastHitWindowOpenRef.current = false
      setHits(h => h + 1)
    }
  }

  return (
    <div style={{ padding: '8px 4px', textAlign: 'center' }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 16px',
        background: pulse ? '#fbbf24' : 'rgba(255,255,255,0.1)',
        boxShadow: pulse ? '0 0 24px #fbbf24' : 'none',
        transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px',
      }}>
        🤔
      </div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '16px' }}>
        {beatIdx} / {beatCount} · 적중 {hits}
      </div>
      <button onClick={handleTap} style={{
        width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
        background: 'linear-gradient(135deg, #818cf8, #6366f1)', color: 'white',
        fontWeight: 'bold', fontSize: '15px', cursor: 'pointer',
      }}>
        끄덕! 👍
      </button>
    </div>
  )
}
