import { useState, useEffect } from 'react'
import { LUMOS_STAGES } from '../data/lumosStages'
import useIsMobile from '../hooks/useIsMobile'
import MonsterImage from '../components/MonsterImage'
import MinigameRouter from '../components/minigames/MinigameRouter'

function RewardPopup({ card, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110,
    }} onClick={onClose}>
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7, #fffbeb)',
        border: '2px solid #fbbf24', borderRadius: '20px', padding: '32px 40px', textAlign: 'center',
        boxShadow: '0 0 40px rgba(251,191,36,0.5)',
        animation: 'popIn 0.3s ease',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{card.emoji}</div>
        <div style={{ fontWeight: 'bold', color: '#92400e', fontSize: '16px', marginBottom: '4px' }}>스킬카드 획득!</div>
        <div style={{ color: '#78350f', fontSize: '14px', marginBottom: '12px' }}>{card.name}</div>
        <div style={{ color: '#b45309', fontSize: '13px' }}>⭐ EXP +10 &nbsp; 🪙 +5</div>
      </div>
      <style>{`@keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  )
}

// NPC 인트로 대화 화면
function NpcIntroDialogue({ stage, onDone }) {
  const lines = stage.npcIntro || []
  const [lineIdx, setLineIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  const advance = () => {
    if (lineIdx < lines.length - 1) {
      setVisible(false)
      setTimeout(() => { setLineIdx(i => i + 1); setVisible(true) }, 180)
    } else {
      onDone()
    }
  }

  const bgStyle = stage.backgroundImage
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(10,8,25,0.45) 0%, rgba(10,8,25,0.85) 100%), url(${stage.backgroundImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }
    : { background: 'linear-gradient(180deg, #0f0c29 0%, #1a1035 100%)' }

  return (
    <div
      onClick={advance}
      style={{
        minHeight: '100vh', ...bgStyle,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end',
        padding: '24px 24px 60px',
        cursor: 'pointer', userSelect: 'none',
      }}
    >
      {/* NPC 이미지 */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        marginBottom: '24px',
      }}>
        <img
          src={stage.npcImage}
          alt={stage.npc}
          style={{
            maxHeight: '55vh', maxWidth: '80vw',
            objectFit: 'contain',
            filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.7))',
          }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      {/* 말풍선 */}
      <div style={{
        width: '100%', maxWidth: '480px',
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '20px', padding: '20px 22px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.18s ease',
        position: 'relative',
      }}>
        {/* 화살표 */}
        <div style={{
          position: 'absolute', top: '-10px', left: '40px',
          width: 0, height: 0,
          borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
          borderBottom: '10px solid rgba(255,255,255,0.97)',
        }} />
        <div style={{ color: stage.monster.color, fontWeight: 'bold', fontSize: '12px', marginBottom: '8px' }}>
          {stage.npc}
        </div>
        <p style={{ margin: 0, fontSize: '15px', color: '#1f2937', lineHeight: '1.6' }}>
          {lines[lineIdx]}
        </p>
        <div style={{ textAlign: 'right', marginTop: '12px', color: '#9ca3af', fontSize: '12px' }}>
          {lineIdx < lines.length - 1 ? '터치해서 계속 ▶' : '터치해서 시작 ▶'}
        </div>
      </div>

      {/* 인디케이터 */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
        {lines.map((_, i) => (
          <div key={i} style={{
            width: i === lineIdx ? '20px' : '6px', height: '6px',
            borderRadius: '3px',
            background: i === lineIdx ? '#fbbf24' : 'rgba(255,255,255,0.3)',
            transition: 'all 0.25s ease',
          }} />
        ))}
      </div>
    </div>
  )
}

export default function NpcDialogueScreen({ stageId, actions, onComplete }) {
  const isMobile = useIsMobile()
  const stage = LUMOS_STAGES.find(s => s.id === stageId)
  const [introDone, setIntroDone] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showMinigame, setShowMinigame] = useState(false)
  const [learnedIds, setLearnedIds] = useState([])
  const [showReward, setShowReward] = useState(null)
  const [allDone, setAllDone] = useState(false)
  const pad = isMobile ? 16 : 24

  if (!stage) return null

  // NPC 인트로 대화 먼저 보여주기
  if (!introDone && stage.npcIntro?.length > 0) {
    return <NpcIntroDialogue stage={stage} onDone={() => setIntroDone(true)} />
  }

  const card = stage.skillCards[currentIdx]
  const totalCards = stage.skillCards.length
  const isLearned = (id) => learnedIds.includes(id)

  const handleMinigameSuccess = () => {
    setShowMinigame(false)
    actions.addExp(10)
    actions.addCoins(5)
    actions.updateProgress(stage.progressKey, 8)
    actions.collectCard(card.id)
    const newLearned = [...learnedIds, card.id]
    setLearnedIds(newLearned)
    setShowReward(card)
    if (newLearned.length === totalCards) {
      setTimeout(() => setAllDone(true), 2200)
    }
  }

  const bgStyle = stage.backgroundImage
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(10,8,25,0.3) 0%, rgba(10,8,25,0.78) 100%), url(${stage.backgroundImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }
    : { background: 'linear-gradient(180deg, #0f0c29 0%, #1a1035 100%)' }

  if (allDone) {
    return (
      <div style={{ minHeight: '100vh', ...bgStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <img
          src={stage.npcImage} alt={stage.npc}
          style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '16px', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }}
          onError={e => { e.target.style.display = 'none' }}
        />
        <h2 style={{ color: '#fbbf24', fontSize: '22px', fontWeight: 'bold', margin: '0 0 12px' }}>
          {stage.npc}: "준비됐어요!"
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>
          {stage.monster.name}에 맞설 스킬카드 5장을 모두 모았어요!
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '32px' }}>
          {stage.catchPhrase}
        </p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {stage.skillCards.map(c => <span key={c.id} style={{ fontSize: '28px' }}>{c.emoji}</span>)}
        </div>
        <button onClick={onComplete} style={{
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          border: 'none', borderRadius: '50px', padding: '16px 48px',
          fontSize: '16px', fontWeight: 'bold', color: '#1a1400', cursor: 'pointer',
          boxShadow: '0 0 30px rgba(251,191,36,0.4)',
        }}>
          🚪 {stage.classroom}으로 입장!
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', ...bgStyle, padding: `20px ${pad}px 80px` }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          background: `${stage.monster.darkColor}80`, borderRadius: '12px',
          padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ fontSize: '16px' }}>🚪</span>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: 'bold' }}>{stage.classroom} 문 앞</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{learnedIds.length} / {totalCards}</span>
      </div>

      {/* 절차 스텝 */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {stage.procedure.map((step, i) => (
          <div key={i} style={{
            padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold',
            background: i <= currentIdx ? `${stage.monster.color}20` : 'rgba(255,255,255,0.05)',
            border: `1px solid ${i <= currentIdx ? stage.monster.color + '40' : 'rgba(255,255,255,0.1)'}`,
            color: i <= currentIdx ? stage.monster.color : 'rgba(255,255,255,0.3)',
          }}>
            {i + 1}. {step}
          </div>
        ))}
      </div>

      {/* 카드 탭 */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto' }}>
        {stage.skillCards.map((c, i) => (
          <button key={c.id} onClick={() => setCurrentIdx(i)} style={{
            minWidth: '44px', height: '44px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: isLearned(c.id) ? '#22c55e' : i === currentIdx ? stage.monster.darkColor : 'rgba(255,255,255,0.05)',
            fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            outline: i === currentIdx ? `2px solid ${stage.monster.color}` : 'none',
            transition: 'all 0.2s',
          }}>
            {isLearned(c.id) ? '✓' : c.emoji}
          </button>
        ))}
      </div>

      {/* NPC + 미션 안내 */}
      <div style={{
        borderRadius: '20px', minHeight: '300px', padding: '24px',
        background: `linear-gradient(135deg, ${stage.monster.darkColor}60, rgba(0,0,0,0.4))`,
        border: `1px solid ${stage.monster.color}30`,
      }}>
        {isLearned(card.id) ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
            <div style={{ fontSize: '48px' }}>✅</div>
            <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: '14px', marginTop: '8px' }}>미션 완료!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={stage.npcImage} alt={stage.npc}
              style={{ width: '88px', height: '88px', objectFit: 'contain', marginBottom: '8px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
              onError={e => { e.target.style.display = 'none' }}
            />
            <div style={{ color: stage.monster.color, fontWeight: 'bold', fontSize: '13px', marginBottom: '14px' }}>
              {stage.npc}
            </div>
            <div style={{
              position: 'relative', background: 'rgba(255,255,255,0.95)', borderRadius: '16px',
              padding: '16px 18px', maxWidth: '320px', marginBottom: '16px',
            }}>
              <div style={{
                position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)',
                width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
                borderBottom: '8px solid rgba(255,255,255,0.95)',
              }} />
              <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#6b7280', lineHeight: '1.5', textAlign: 'center' }}>
                "{card.description}"
              </p>
              {card.missionInstruction && (
                <div style={{
                  background: '#fef3c7', borderRadius: '8px', padding: '8px 12px',
                  borderLeft: '3px solid #fbbf24',
                }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#92400e', fontWeight: 'bold', textAlign: 'center' }}>
                    🎯 {card.missionInstruction}
                  </p>
                </div>
              )}
            </div>
            <div style={{ display: 'inline-block', background: `${stage.monster.color}20`, borderRadius: '20px', padding: '3px 12px', marginBottom: '16px' }}>
              <span style={{ color: stage.monster.color, fontSize: '11px', fontWeight: 'bold' }}>
                스킬 {currentIdx + 1}/{totalCards} · {card.name}
              </span>
            </div>
            <button
              onClick={() => setShowMinigame(true)}
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                border: 'none', borderRadius: '30px', padding: '12px 32px',
                fontSize: '14px', fontWeight: 'bold', color: '#1a1400', cursor: 'pointer',
              }}
            >
              🎮 미션 도전하기
            </button>
          </div>
        )}
      </div>

      {showMinigame && (
        <MinigameRouter card={card} onSuccess={handleMinigameSuccess} onCancel={() => setShowMinigame(false)} />
      )}
      {showReward && <RewardPopup card={showReward} onClose={() => setShowReward(null)} />}
    </div>
  )
}
