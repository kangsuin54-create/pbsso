import { useState, useEffect } from 'react'
import StatusBar from '../components/StatusBar'
import ProgressGoals from '../components/ProgressGoals'
import useIsMobile from '../hooks/useIsMobile'

const ACTIONS = [
  {
    id: 'cooperation',
    emoji: '🤝',
    label: '협력 행동하기',
    desc: '친구와 함께 힘을 합쳐요!',
    color: '#dbeafe',
    border: '#60a5fa',
    reward: { type: 'exp', amount: 30, message: '+30 EXP 획득! ⭐', progress: 'social', progressAmt: 15 },
    animation: 'exp',
  },
  {
    id: 'wait',
    emoji: '⏳',
    label: '차례 기다리기',
    desc: '인내심을 발휘해요!',
    color: '#d1fae5',
    border: '#34d399',
    reward: { type: 'item', item: '인내의 보석 💎', message: '아이템 획득! 💎', progress: 'selfControl', progressAmt: 20 },
    animation: 'item',
  },
  {
    id: 'help',
    emoji: '💪',
    label: '친구 돕기',
    desc: '친구의 영웅이 되어요!',
    color: '#ede9fe',
    border: '#a78bfa',
    reward: { type: 'team', amount: 15, message: '+15 팀포인트! 🤝', progress: 'positiveRelationship', progressAmt: 20 },
    animation: 'team',
  },
  {
    id: 'emotion',
    emoji: '🧘',
    label: '감정 조절 성공',
    desc: '마음을 차분히 다스려요!',
    color: '#fef3c7',
    border: '#fbbf24',
    reward: { type: 'badge', badge: '감정 마스터 🏅', message: '특별 배지 해금! 🏅', progress: 'selfControl', progressAmt: 25 },
    animation: 'badge',
  },
]

function FloatingReward({ text, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '28px', fontWeight: 'bold', color: '#1f2937',
      background: 'white', borderRadius: '16px', padding: '16px 28px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      animation: 'bounce-in 0.4s ease-out',
      zIndex: 999,
      pointerEvents: 'none',
    }}>
      {text}
    </div>
  )
}

function ItemBoxEffect({ onDone }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setOpen(true), 400)
    const t2 = setTimeout(onDone, 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center', zIndex: 999,
    }}>
      <div style={{ fontSize: open ? '80px' : '60px', transition: 'font-size 0.3s', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
        {open ? '🎁' : '📦'}
      </div>
      {open && (
        <div style={{
          background: 'white', borderRadius: '12px', padding: '10px 20px',
          marginTop: '8px', fontWeight: 'bold', fontSize: '18px', color: '#7c3aed',
          animation: 'slide-in-up 0.3s ease-out',
        }}>
          아이템 획득! 💎
        </div>
      )}
    </div>
  )
}

function BadgeEffect({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center', zIndex: 999,
      background: 'white', borderRadius: '20px', padding: '24px 36px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      animation: 'bounce-in 0.5s ease-out',
    }}>
      <div style={{ fontSize: '64px', marginBottom: '8px' }}>🏅</div>
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#7c3aed' }}>새 배지 해금!</div>
      <div style={{ fontSize: '16px', color: '#6b7280', marginTop: '4px' }}>감정 마스터 🏅</div>
    </div>
  )
}

function GaugeEffect({ current }) {
  return (
    <div style={{
      position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
      background: 'white', borderRadius: '16px', padding: '12px 24px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 999, minWidth: '240px',
      animation: 'slide-in-up 0.3s ease-out',
    }}>
      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '6px' }}>
        🤝 팀 포인트 게이지
      </div>
      <div style={{ background: '#e5e7eb', borderRadius: '99px', height: '12px', overflow: 'hidden' }}>
        <div style={{
          background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
          width: `${Math.min(current, 100)}%`,
          height: '100%', borderRadius: '99px', transition: 'width 0.8s ease',
        }} />
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>팀포인트: {current}</div>
    </div>
  )
}

export default function ReinforcementScreen({ playerData, actions }) {
  const isMobile = useIsMobile()
  const [effect, setEffect] = useState(null)
  const [clickedActions, setClickedActions] = useState([])
  const [allDone, setAllDone] = useState(false)

  const handleAction = (action) => {
    const r = action.reward
    actions.addCoins(8)
    if (r.type === 'exp') {
      actions.addExp(r.amount)
      actions.updateProgress(r.progress, r.progressAmt)
      setEffect({ type: 'float', text: r.message })
    } else if (r.type === 'item') {
      actions.addItem(r.item)
      actions.updateProgress(r.progress, r.progressAmt)
      setEffect({ type: 'item' })
    } else if (r.type === 'team') {
      actions.addTeamPoints(r.amount)
      setEffect({ type: 'gauge' })
    } else if (r.type === 'badge') {
      actions.addBadge(r.badge)
      actions.updateProgress(r.progress, r.progressAmt)
      setEffect({ type: 'badge' })
    }
    setClickedActions(prev => {
      const next = [...prev, action.id]
      if (next.length === ACTIONS.length) setTimeout(() => setAllDone(true), 2000)
      return next
    })
  }

  if (allDone) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <StatusBar playerData={playerData} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '24px' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🌟</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>보상 미션 완료!</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '16px' }}>
            모든 착한 행동에 보상을 받았어요! 👏
          </p>
          <button onClick={() => actions.goTo('simulation')} style={{
            background: 'linear-gradient(135deg, #059669, #0284c7)', color: 'white', border: 'none',
            borderRadius: '99px', padding: '16px 40px', fontSize: '20px', fontWeight: 'bold',
            cursor: 'pointer', boxShadow: '0 8px 24px rgba(5,150,105,0.4)',
          }}>실전 연습 하러 가기! 🎭</button>
        </div>
        <ProgressGoals progress={playerData.progress} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <StatusBar playerData={playerData} />
      <div style={{ flex: 1, padding: isMobile ? '12px' : '20px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '14px' : '20px' }}>
          <h2 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '6px' }}>
            🎁 2단계: 보상 받기
          </h2>
          <p style={{ color: '#6b7280', fontSize: '13px' }}>착한 행동을 선택하고 보상을 받아요!</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '10px' : '14px' }}>
          {ACTIONS.map(action => {
            const done = clickedActions.includes(action.id)
            return (
              <button key={action.id} onClick={() => !done && handleAction(action)} style={{
                background: done ? '#f3f4f6' : action.color,
                border: `3px solid ${done ? '#d1d5db' : action.border}`,
                borderRadius: '18px', padding: isMobile ? '16px 10px' : '20px 14px',
                cursor: done ? 'default' : 'pointer',
                transition: 'all 0.3s', textAlign: 'center',
                opacity: done ? 0.6 : 1,
                transform: done ? 'scale(0.97)' : 'scale(1)',
                boxShadow: done ? 'none' : '0 4px 16px rgba(0,0,0,0.1)',
                minHeight: isMobile ? '110px' : '130px',
              }}>
                <div style={{ fontSize: isMobile ? '36px' : '48px', marginBottom: '6px', filter: done ? 'grayscale(1)' : 'none' }}>
                  {done ? '✅' : action.emoji}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: isMobile ? '13px' : '15px', color: done ? '#9ca3af' : '#1f2937', marginBottom: '3px' }}>
                  {action.label}
                </div>
                <div style={{ fontSize: '11px', color: done ? '#d1d5db' : '#6b7280' }}>
                  {done ? '완료!' : action.desc}
                </div>
              </button>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px', color: '#9ca3af', fontSize: '13px' }}>
          {clickedActions.length}/{ACTIONS.length} 완료
        </div>
      </div>

      <ProgressGoals progress={playerData.progress} />

      {effect?.type === 'float' && <FloatingReward text={effect.text} onDone={() => setEffect(null)} />}
      {effect?.type === 'item' && <ItemBoxEffect onDone={() => setEffect(null)} />}
      {effect?.type === 'badge' && <BadgeEffect onDone={() => setEffect(null)} />}
      {effect?.type === 'gauge' && <GaugeEffect current={playerData.teamPoints} onDone={() => setEffect(null)} />}
    </div>
  )
}