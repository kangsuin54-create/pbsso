import { useEffect, useRef, useState } from 'react'

// 레인 안에서 포인터로 토큰을 이동, 위에서 떨어지는 장애물을 회피. durationMs 동안 생존하면 성공.
export default function DragAvoidGame({ config, onSuccess, onFail }) {
  const { durationMs = 7000, obstacleIntervalMs = 900, obstacleSpeed = 0.06 } = config
  const laneRef = useRef(null)
  const [tokenX, setTokenX] = useState(50)
  const [obstacles, setObstacles] = useState([])
  const startRef = useRef(null)
  const rafRef = useRef(null)
  const doneRef = useRef(false)
  const lastSpawnRef = useRef(0)

  useEffect(() => {
    startRef.current = performance.now()
    const tick = (now) => {
      const elapsed = now - startRef.current
      if (elapsed - lastSpawnRef.current > obstacleIntervalMs) {
        lastSpawnRef.current = elapsed
        setObstacles(obs => [...obs, { id: now, x: Math.random() * 86 + 7, y: -10 }])
      }
      setObstacles(obs => obs
        .map(o => ({ ...o, y: o.y + obstacleSpeed * 100 }))
        .filter(o => o.y < 110)
      )
      if (elapsed >= durationMs && !doneRef.current) {
        doneRef.current = true
        onSuccess()
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 충돌 체크
  useEffect(() => {
    if (doneRef.current) return
    const hit = obstacles.some(o => o.y > 70 && o.y < 90 && Math.abs(o.x - tokenX) < 10)
    if (hit) {
      doneRef.current = true
      onFail()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obstacles, tokenX])

  const handlePointerMove = (e) => {
    const rect = laneRef.current.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    setTokenX(Math.max(5, Math.min(95, pct)))
  }

  return (
    <div
      ref={laneRef}
      onPointerMove={handlePointerMove}
      style={{
        position: 'relative', height: '220px', borderRadius: '14px',
        background: 'rgba(255,255,255,0.05)', overflow: 'hidden', touchAction: 'none', cursor: 'pointer',
      }}
    >
      {obstacles.map(o => (
        <div key={o.id} style={{
          position: 'absolute', top: `${o.y}%`, left: `${o.x}%`,
          width: '18px', height: '18px', borderRadius: '50%', transform: 'translate(-50%,-50%)',
          background: '#f87171', boxShadow: '0 0 8px #f87171',
        }} />
      ))}
      <div style={{
        position: 'absolute', top: '80%', left: `${tokenX}%`,
        width: '28px', height: '28px', borderRadius: '50%', transform: 'translate(-50%,-50%)',
        background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', boxShadow: '0 0 12px #38bdf8',
      }} />
      <div style={{
        position: 'absolute', bottom: '6px', left: 0, right: 0, textAlign: 'center',
        color: 'rgba(255,255,255,0.4)', fontSize: '11px',
      }}>
        손가락으로 밀어서 피해요 🌊
      </div>
    </div>
  )
}
