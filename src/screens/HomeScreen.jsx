import { useState, useEffect } from 'react'
import useIsMobile from '../hooks/useIsMobile'
import BottomNav from '../components/BottomNav'
function DailyMissionPanel({ missions, streakCount }) {
  if (!missions || missions.length === 0) return null
  return (
    <div style={{
      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(251,191,36,0.2)',
      borderRadius: '16px', padding: '14px', marginBottom: '16px', width: '100%', maxWidth: '380px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '13px' }}>📅 오늘의 미션</span>
        {streakCount > 0 && (
          <span style={{
            background: 'rgba(251,191,36,0.15)', borderRadius: '20px',
            padding: '2px 10px', color: '#fbbf24', fontSize: '11px', fontWeight: 'bold',
          }}>🔥 {streakCount}일 연속</span>
        )}
      </div>
      {missions.map(m => (
        <div key={m.id} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <span style={{ fontSize: '16px' }}>{m.icon}</span>
          <span style={{ flex: 1, color: m.completed ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)', fontSize: '12px', textDecoration: m.completed ? 'line-through' : 'none' }}>
            {m.title}
          </span>
          {m.completed
            ? <span style={{ color: '#34d399', fontSize: '14px' }}>✓</span>
            : <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>+{m.reward_coins}🪙</span>
          }
        </div>
      ))}
    </div>
  )
}

export default function HomeScreen({ onStart, user, onLogout, playerData, actions, dailyMissions, streakCount }) {
  const isMobile = useIsMobile()
  const [floatY, setFloatY] = useState(0)

  useEffect(() => {
    let t = 0
    const id = setInterval(() => { t += 0.05; setFloatY(Math.sin(t) * 8) }, 50)
    return () => clearInterval(id)
  }, [])

  const clearedCount = playerData?.clearedStages?.length || 0

  return (
    <>
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '16px' : '24px',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    }}>
      {/* 유저 정보 */}
      {user && (
        <div style={{
          position: 'fixed', top: '10px', right: '10px',
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'rgba(255,255,255,0.08)', borderRadius: '99px',
          padding: isMobile ? '5px 10px' : '6px 14px',
          border: '1px solid rgba(255,255,255,0.15)', zIndex: 100,
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontSize: '16px' }}>👤</span>
          {!isMobile && (
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.user_metadata?.nickname || user?.email?.split('@')[0] || '정화단원'}
            </span>
          )}
          <button onClick={onLogout} style={{
            background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '99px',
            padding: '4px 10px', fontSize: '12px', color: '#fca5a5',
            cursor: 'pointer', fontWeight: 'bold',
          }}>로그아웃</button>
        </div>
      )}

      {/* 루모스 크리스탈 진행 */}
      {clearedCount > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px',
          background: 'rgba(251,191,36,0.1)', borderRadius: '20px', padding: '6px 14px',
          border: '1px solid rgba(251,191,36,0.2)',
        }}>
          <span style={{ fontSize: '16px' }}>💎</span>
          <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>
            {clearedCount}/8 교실 정화 완료
          </span>
        </div>
      )}

      {/* 마스코트 */}
      <div style={{
        fontSize: isMobile ? '72px' : '100px',
        transform: `translateY(${floatY}px)`,
        transition: 'transform 0.05s linear',
        marginBottom: '12px',
        filter: 'drop-shadow(0 0 20px rgba(251,191,36,0.5))',
      }}>💡</div>

      {/* 타이틀 */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? '16px' : '20px' }}>
        <div style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '4px' }}>
          L.U.M.O.S
        </div>
        <h1 style={{
          fontSize: isMobile ? '22px' : '30px', fontWeight: '900', marginBottom: '6px',
          color: 'white', lineHeight: 1.2,
        }}>빛의 퀘스트</h1>
        <p style={{ fontSize: isMobile ? '13px' : '15px', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>
          내 안의 몬스터를 빛으로 깨워라 ✨
        </p>
      </div>

      {/* 일일 미션 */}
      <DailyMissionPanel missions={dailyMissions} streakCount={streakCount} />

      {/* 스테이지 현황 카드 */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: isMobile ? '8px' : '12px',
        maxWidth: isMobile ? '320px' : '380px',
        width: '100%', marginBottom: isMobile ? '20px' : '24px',
      }}>
        {[
          { emoji: '📚', title: '스킬카드 학습', desc: '5개의 스킬로 준비', color: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.3)' },
          { emoji: '⚔️', title: '몬스터 정화', desc: '어둠을 빛으로 바꾸기', color: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.3)' },
          { emoji: '💎', title: '정화 아이템', desc: '8개 아이템 수집', color: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.3)' },
          { emoji: '🏆', title: '루모스 크리스탈', desc: '학교에 빛을 되찾아요', color: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.3)' },
        ].map((item, i) => (
          <div key={i} style={{
            background: item.color, border: `1px solid ${item.border}`,
            borderRadius: '14px', padding: isMobile ? '12px 10px' : '14px', textAlign: 'center',
          }}>
            <div style={{ fontSize: isMobile ? '26px' : '30px', marginBottom: '4px' }}>{item.emoji}</div>
            <div style={{ fontWeight: 'bold', fontSize: isMobile ? '11px' : '13px', color: 'white' }}>{item.title}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* 시작 버튼 */}
      <button onClick={onStart} style={{
        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        color: '#1a1400', border: 'none', borderRadius: '99px',
        padding: isMobile ? '15px 40px' : '18px 48px',
        fontSize: isMobile ? '17px' : '20px', fontWeight: '900',
        cursor: 'pointer', boxShadow: '0 0 30px rgba(251,191,36,0.4)',
        transition: 'all 0.2s', letterSpacing: '1px', width: isMobile ? '100%' : 'auto',
        maxWidth: '320px',
      }}>
        {clearedCount === 0 ? '⚔️ 퀘스트 시작!' : `💡 계속하기 (${clearedCount}/8)`}
      </button>

      <p style={{ marginTop: '14px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '70px' }}>
        L.U.M.O.S — Light Up Monster Of Self
      </p>
    </div>
    <BottomNav current="home" onNavigate={actions.goTo} />
    </>
  )
}
