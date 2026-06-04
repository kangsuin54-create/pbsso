import { useState } from 'react'

const SLIDES = [
  {
    emoji: '🌑',
    bg: 'linear-gradient(135deg, #0f0c29, #302b63)',
    title: '어둠이 내려앉은 학교',
    text: '평화롭던 우리 학교에 마음의 어둠을 먹고 사는 "그림자 안개"가 들이닥쳤어요.\n\n아이들의 웃음소리가 사라지고 학교의 모든 불이 꺼졌습니다.',
    accent: '#a78bfa',
  },
  {
    emoji: '👾',
    bg: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    title: '8마리 마음 몬스터',
    text: '8개의 교실마다 다른 마음 몬스터가 자리를 차지했어요.\n\n아르케, 엔비어스, 아펠로, 이카리마...\n각자의 어둠으로 학교를 물들이고 있습니다.',
    accent: '#f472b6',
  },
  {
    emoji: '✨',
    bg: 'linear-gradient(135deg, #0d1b2a, #1b4332)',
    title: '루모스 정화단',
    text: '이제 여러분이 "루모스 정화단"이 되어 어둠에 잠긴 학교의 불을 다시 밝혀야 해요!\n\n스킬 카드를 모아 몬스터를 정화하고 빛을 되찾으세요.',
    accent: '#34d399',
  },
  {
    emoji: '💡',
    bg: 'linear-gradient(135deg, #1a1400, #2d2600)',
    title: 'L.U.M.O.S!',
    text: '"어둠 속에 숨은 몬스터를 만날 때,\n주문을 외워봐.\n\nL.U.M.O.S!\n내 안의 몬스터를 빛으로 깨워라!"',
    accent: '#fbbf24',
    isFinal: true,
  },
]

export default function StoryIntroScreen({ onComplete }) {
  const [idx, setIdx] = useState(0)
  const [animating, setAnimating] = useState(false)

  const slide = SLIDES[idx]

  const next = () => {
    if (animating) return
    if (idx < SLIDES.length - 1) {
      setAnimating(true)
      setTimeout(() => { setIdx(i => i + 1); setAnimating(false) }, 300)
    } else {
      onComplete()
    }
  }

  return (
    <div
      onClick={slide.isFinal ? undefined : next}
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: slide.bg,
        padding: '32px 24px',
        transition: 'background 0.5s ease',
        cursor: slide.isFinal ? 'default' : 'pointer',
        userSelect: 'none',
      }}
    >
      {/* 건너뛰기 */}
      <button
        onClick={(e) => { e.stopPropagation(); onComplete() }}
        style={{
          position: 'absolute', top: 20, right: 20,
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.6)', borderRadius: '20px',
          padding: '6px 16px', fontSize: '13px', cursor: 'pointer',
        }}
      >
        건너뛰기
      </button>

      {/* 슬라이드 인디케이터 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
        {SLIDES.map((_, i) => (
          <div key={i} style={{
            width: i === idx ? '24px' : '8px', height: '8px',
            borderRadius: '4px',
            background: i === idx ? slide.accent : 'rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateY(10px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        textAlign: 'center', maxWidth: '400px',
      }}>
        {/* 이모지 */}
        <div style={{
          fontSize: '96px', marginBottom: '32px',
          filter: `drop-shadow(0 0 20px ${slide.accent})`,
          animation: 'float 3s ease-in-out infinite',
        }}>
          {slide.emoji}
        </div>

        {/* 제목 */}
        <h1 style={{
          fontSize: '24px', fontWeight: 'bold', marginBottom: '20px',
          color: slide.accent,
          textShadow: `0 0 20px ${slide.accent}80`,
        }}>
          {slide.title}
        </h1>

        {/* 본문 */}
        <p style={{
          fontSize: '15px', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)',
          whiteSpace: 'pre-line', marginBottom: '40px',
        }}>
          {slide.text}
        </p>

        {/* 버튼 */}
        {slide.isFinal ? (
          <button
            onClick={onComplete}
            style={{
              background: `linear-gradient(135deg, ${slide.accent}, #f59e0b)`,
              border: 'none', borderRadius: '50px',
              padding: '16px 48px', fontSize: '18px', fontWeight: 'bold',
              color: '#1a1400', cursor: 'pointer',
              boxShadow: `0 0 30px ${slide.accent}60`,
              transform: 'scale(1)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            ⚔️ 모험 시작!
          </button>
        ) : (
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            화면을 터치하여 계속
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  )
}
