import { useState, useEffect } from 'react'

const SLIDES = [
  '/outro/outro_scene1.png',
  '/outro/outro_scene2.png',
  '/outro/outro_scene3.png',
  '/outro/outro_scene4.png',
  '/outro/outro_scene5.png',
  '/outro/outro_scene6.png',
  '/outro/outro_scene7.png',
  '/outro/outro_scene8.png',
  '/outro/outro_scene9.png',
  '/outro/outro_scene10.png',
]

const SLIDE_DURATION = 3000

export default function OutroScreen({ onComplete }) {
  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    if (idx >= SLIDES.length - 1) return
    const t = setTimeout(() => {
      setFade(false)
      setTimeout(() => {
        setIdx(i => i + 1)
        setFade(true)
      }, 300)
    }, SLIDE_DURATION)
    return () => clearTimeout(t)
  }, [idx])

  const isLast = idx === SLIDES.length - 1

  return (
    <div
      style={{
        minHeight: '100vh', width: '100%',
        position: 'relative', overflow: 'hidden',
        background: '#0a0818',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: isLast ? 'default' : 'pointer',
        userSelect: 'none',
      }}
      onClick={() => {
        if (!isLast) {
          setFade(false)
          setTimeout(() => { setIdx(i => Math.min(i + 1, SLIDES.length - 1)); setFade(true) }, 200)
        }
      }}
    >
      <img
        src={SLIDES[idx]}
        alt={`아웃트로 ${idx + 1}`}
        style={{
          width: '100%', height: '100vh',
          objectFit: 'contain',
          opacity: fade ? 1 : 0,
          transition: 'opacity 0.3s ease',
          display: 'block',
        }}
      />

      {/* 인디케이터 */}
      <div style={{
        position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '6px', zIndex: 10,
      }}>
        {SLIDES.map((_, i) => (
          <div key={i} style={{
            width: i === idx ? '20px' : '6px', height: '6px',
            borderRadius: '3px',
            background: i === idx ? '#fbbf24' : 'rgba(255,255,255,0.25)',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* 마지막 슬라이드: 완료 버튼 */}
      {isLast && (
        <button
          onClick={onComplete}
          style={{
            position: 'fixed', bottom: 72, left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            border: 'none', borderRadius: '50px',
            padding: '14px 48px', fontSize: '17px', fontWeight: 'bold',
            color: '#1a1400', cursor: 'pointer',
            boxShadow: '0 0 30px rgba(251,191,36,0.5)',
            zIndex: 10, whiteSpace: 'nowrap',
          }}
        >
          💎 루모스 크리스탈 보기
        </button>
      )}
    </div>
  )
}
