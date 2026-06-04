import { useEffect, useState } from 'react'

const LEVEL_REWARDS = {
  2:  { coins: 20,  message: '드디어 레벨 2! 상점 기본 아이템이 열렸어요!' },
  3:  { coins: 30,  message: '레벨 3 달성! 동반자 아이템을 구매할 수 있어요!' },
  4:  { coins: 40,  message: '레벨 4! 왕관과 희귀 아이템에 도전해봐요!' },
  5:  { coins: 60,  message: '레벨 5 — 진짜 모험가가 됐어요! 🌟' },
  6:  { coins: 80,  message: '레벨 6! 전설의 길이 열리고 있어요! 💎' },
  7:  { coins: 100, message: '레벨 7! 거의 마스터 모험가에요! 🏆' },
  8:  { coins: 120, message: '레벨 8! 유니콘과 드래곤을 가질 자격이 충분해요! 🦄' },
  9:  { coins: 150, message: '레벨 9! 전설 중의 전설! 🌈' },
  10: { coins: 200, message: '레벨 10! 최고의 사회성 마스터! 👑' },
}

const CONFETTI = ['🎊','🎉','⭐','🌟','✨','💫','🎈','🎁']

export default function LevelUpPopup({ level, onClose }) {
  const [particles, setParticles] = useState([])
  const reward = LEVEL_REWARDS[level] || { coins: level * 10, message: `레벨 ${level}! 계속 성장하고 있어요!` }

  useEffect(() => {
    setParticles(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        emoji: CONFETTI[i % CONFETTI.length],
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.5}s`,
        size: `${16 + Math.random() * 16}px`,
      }))
    )
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '20px',
    }} onClick={onClose}>
      {/* 파티클 */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'fixed', top: '-20px', left: p.left,
          fontSize: p.size, animationDelay: p.delay,
          animation: `exp-rise 2s ease-out ${p.delay} forwards`,
          pointerEvents: 'none',
        }}>{p.emoji}</div>
      ))}

      <div onClick={e => e.stopPropagation()} style={{
        background: 'white', borderRadius: '28px', padding: '36px 28px',
        textAlign: 'center', maxWidth: '340px', width: '100%',
        boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
        animation: 'bounce-in 0.5s ease-out',
        border: '4px solid #fcd34d',
      }}>
        <div style={{ fontSize: '72px', marginBottom: '8px', lineHeight: 1 }}>🎊</div>

        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#9ca3af', letterSpacing: '2px', marginBottom: '4px' }}>
          LEVEL UP!
        </div>

        <div style={{
          fontSize: '56px', fontWeight: '900', lineHeight: 1, marginBottom: '12px',
          background: 'linear-gradient(135deg, #f59e0b, #ef4444, #7c3aed)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Lv.{level}
        </div>

        <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6', marginBottom: '16px' }}>
          {reward.message}
        </p>

        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          border: '3px solid #fbbf24', borderRadius: '16px',
          padding: '14px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          <span style={{ fontSize: '28px' }}>🪙</span>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#92400e' }}>+{reward.coins} 코인</div>
            <div style={{ fontSize: '12px', color: '#b45309' }}>레벨업 보너스!</div>
          </div>
        </div>

        <button onClick={onClose} style={{
          background: 'linear-gradient(135deg, #7c3aed, #db2777)',
          color: 'white', border: 'none', borderRadius: '99px',
          padding: '14px 32px', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(124,58,237,0.4)', width: '100%',
        }}>
          계속 모험하기! 🚀
        </button>
      </div>
    </div>
  )
}
