import { useState, useEffect } from 'react'
import useIsMobile from '../hooks/useIsMobile'

const GOALS = [
  { key: 'selfControl', label: '자기조절', emoji: '🧘', color: '#a78bfa' },
  { key: 'social', label: '사회성', emoji: '👫', color: '#34d399' },
  { key: 'ruleUnderstanding', label: '규칙 이해', emoji: '📖', color: '#60a5fa' },
  { key: 'positiveRelationship', label: '긍정적 관계', emoji: '💛', color: '#fbbf24' },
]

function StarRating({ value }) {
  const stars = Math.ceil((value / 100) * 5)
  return (
    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: '24px', filter: i <= stars ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</span>
      ))}
    </div>
  )
}

function AnimatedBar({ value, color, delay }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return (
    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '99px', height: '16px', overflow: 'hidden' }}>
      <div style={{
        background: color, width: `${width}%`, height: '100%',
        borderRadius: '99px', transition: 'width 1s ease', position: 'relative',
      }}>
        {width > 20 && (
          <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: '#1a1400', fontWeight: 'bold' }}>
            {value}%
          </span>
        )}
      </div>
    </div>
  )
}

export default function DashboardScreen({ playerData, onRestart }) {
  const isMobile = useIsMobile()
  const [showConfetti, setShowConfetti] = useState(true)
  const totalProgress = Object.values(playerData.progress).reduce((a, b) => a + b, 0) / 4
  const grade = totalProgress >= 80 ? '🥇 금' : totalProgress >= 60 ? '🥈 은' : totalProgress >= 40 ? '🥉 동' : '📜 참가'

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f0c29 0%, #1a1035 60%, #0d1b2a 100%)', padding: isMobile ? '12px' : '20px' }}>
      {/* 상단 축하 */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? '14px' : '24px' }}>
        {showConfetti && (
          <div style={{ fontSize: '28px', marginBottom: '6px', animation: 'bounce-in 0.5s ease-out' }}>
            🎊🎉🎊🎉🎊
          </div>
        )}
        <h1 style={{
          fontSize: isMobile ? '22px' : '28px', fontWeight: '900', marginBottom: '6px',
          color: '#fbbf24', textShadow: '0 0 20px rgba(251,191,36,0.5)',
        }}>
          오늘의 성장 리포트 📊
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>모험을 완료했어요! 정말 대단해요! 🌟</p>
      </div>

      {/* 종합 등급 */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', borderRadius: '20px', padding: '20px', marginBottom: '16px',
        textAlign: 'center', border: '2px solid rgba(251,191,36,0.3)',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '6px' }}>{grade.split(' ')[0]}</div>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
          {grade.split(' ')[1]} 등급 달성!
        </div>
        <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
          평균 성장률: {Math.round(totalProgress)}%
        </div>
        <StarRating value={totalProgress} />
      </div>

      {/* 플레이어 스탯 */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: isMobile ? '8px' : '10px', marginBottom: isMobile ? '10px' : '16px',
      }}>
        {[
          { label: '획득 EXP', value: `${playerData.exp}`, emoji: '⭐', color: 'rgba(251,191,36,0.12)', border: '#fcd34d', text: '#fbbf24' },
          { label: '팀 포인트', value: `${playerData.teamPoints}`, emoji: '🤝', color: 'rgba(96,165,250,0.12)', border: '#60a5fa', text: '#93c5fd' },
          { label: '배지 수', value: `${playerData.badges.length}개`, emoji: '🏅', color: 'rgba(167,139,250,0.12)', border: '#a78bfa', text: '#c4b5fd' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: stat.color, border: `2px solid ${stat.border}`,
            borderRadius: '14px', padding: isMobile ? '10px 6px' : '14px', textAlign: 'center',
          }}>
            <div style={{ fontSize: isMobile ? '22px' : '28px', marginBottom: '3px' }}>{stat.emoji}</div>
            <div style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 'bold', color: stat.text }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 성장 목표 진행률 */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', borderRadius: '20px', padding: '20px', marginBottom: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
          🎯 성장 목표 달성률
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {GOALS.map((goal, i) => (
            <div key={goal.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                <span style={{ fontWeight: 'bold' }}>{goal.emoji} {goal.label}</span>
                <span style={{ color: goal.color, fontWeight: 'bold' }}>{playerData.progress[goal.key]}%</span>
              </div>
              <AnimatedBar value={playerData.progress[goal.key]} color={goal.color} delay={i * 200 + 300} />
            </div>
          ))}
        </div>
      </div>

      {/* 획득 배지 */}
      {playerData.badges.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: '20px', padding: '20px', marginBottom: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
            🏅 획득한 배지
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {playerData.badges.map((badge, i) => (
              <div key={i} style={{
                background: 'rgba(167,139,250,0.12)', border: '2px solid rgba(167,139,250,0.4)',
                borderRadius: '99px', padding: '6px 14px',
                fontSize: '13px', fontWeight: 'bold', color: '#c4b5fd',
                animation: `star-pop 0.5s ease-out ${i * 0.1}s both`,
              }}>
                {badge}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 획득 아이템 */}
      {playerData.items.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: '20px', padding: '20px', marginBottom: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
            🎒 획득한 아이템
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {playerData.items.map((item, i) => (
              <div key={i} style={{
                background: 'rgba(251,191,36,0.12)', border: '2px solid rgba(251,191,36,0.4)',
                borderRadius: '99px', padding: '6px 14px',
                fontSize: '13px', fontWeight: 'bold', color: '#fbbf24',
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 응원 메시지 */}
      <div style={{
        background: 'rgba(52,211,153,0.08)',
        border: '2px solid rgba(110,231,183,0.3)', borderRadius: '20px', padding: '20px', marginBottom: '20px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>🌈</div>
        <p style={{ fontSize: '16px', color: '#6ee7b7', fontWeight: '600', lineHeight: '1.6' }}>
          {totalProgress >= 70
            ? '오늘 정말 훌륭하게 성장했어요! 친구들과 더욱 행복한 시간을 보낼 수 있을 거예요! 💚'
            : '잘 하고 있어요! 조금 더 연습하면 훨씬 더 잘할 수 있어요! 포기하지 마요! 💪'}
        </p>
      </div>

      {/* 다시 시작 버튼 */}
      <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
        <button onClick={onRestart} style={{
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#1a1400', border: 'none',
          borderRadius: '99px', padding: '16px 40px', fontSize: '20px', fontWeight: 'bold',
          cursor: 'pointer', boxShadow: '0 0 30px rgba(251,191,36,0.4)',
        }}>
          🔄 다시 모험하기!
        </button>
      </div>
    </div>
  )
}
