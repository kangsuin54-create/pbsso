import { useState } from 'react'

const SLIDES = [
  '/intro/intro_1.png',
  '/intro/intro_2.png',
  '/intro/intro_3.png',
  '/intro/intro_4.png',
  '/intro/intro_5.png',
]

export default function StoryIntroScreen({ onComplete }) {
  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState(true)

  const goTo = (next) => {
    setFade(false)
    setTimeout(() => {
      setIdx(next)
      setFade(true)
    }, 200)
  }

  const handleClick = () => {
    if (idx < SLIDES.length - 1) {
      goTo(idx + 1)
    } else {
      onComplete()
    }
  }

  const isLast = idx === SLIDES.length - 1

  return (
    <div
      onClick={handleClick}
      style={{
        minHeight: '100vh', width: '100%',
        position: 'relative', overflow: 'hidden',
        background: '#0a0818',
        cursor: 'pointer', userSelect: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* 이미지 */}
      <img
        src={SLIDES[idx]}
        alt={`인트로 ${idx + 1}`}
        style={{
          width: '100%', height: '100vh',
          objectFit: 'contain',
          opacity: fade ? 1 : 0,
          transition: 'opacity 0.2s ease',
          display: 'block',
        }}
      />

      {/* 건너뛰기 */}
      <button
        onClick={(e) => { e.stopPropagation(); onComplete() }}
        style={{
          position: 'fixed', top: 20, right: 20,
          background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.25)',
          color: 'rgba(255,255,255,0.7)', borderRadius: '20px',
          padding: '6px 16px', fontSize: '13px', cursor: 'pointer',
          zIndex: 10,
        }}
      >
        건너뛰기
      </button>

      {/* 인디케이터 */}
      <div style={{
        position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '8px', zIndex: 10,
      }}>
        {SLIDES.map((_, i) => (
          <div key={i} style={{
            width: i === idx ? '24px' : '8px', height: '8px',
            borderRadius: '4px',
            background: i === idx ? '#fbbf24' : 'rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* 마지막 슬라이드: 시작 버튼 */}
      {isLast && (
        <button
          onClick={(e) => { e.stopPropagation(); onComplete() }}
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
          ⚔️ 모험 시작!
        </button>
      )}

      {/* 마지막 아닐 때: 터치 안내 */}
      {!isLast && (
        <div style={{
          position: 'fixed', bottom: 72, left: '50%', transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.4)', fontSize: '12px', zIndex: 10,
          whiteSpace: 'nowrap',
        }}>
          화면을 터치하여 계속
        </div>
      )}
    </div>
  )
}
