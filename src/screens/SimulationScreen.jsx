import { useState, useEffect } from 'react'
import { LUMOS_STAGES } from '../data/lumosStages'
import useIsMobile from '../hooks/useIsMobile'
import MonsterImage from '../components/MonsterImage'
import MinigameRouter from '../components/minigames/MinigameRouter'

// 몬스터 어둠 게이지 — RPG HP바 스타일 (어두울수록 붉게, 정화될수록 황금색으로)
function DarkGauge({ value }) {
  const barColor = value > 50 ? '#ef4444' : value > 0 ? '#fbbf24' : '#34d399'
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>어둠 수치</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: 'bold' }}>{value}%</span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
        <div style={{
          height: '100%', borderRadius: '8px',
          background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
          width: `${value}%`,
          transition: 'width 0.8s ease, background 0.8s ease',
          boxShadow: `0 0 10px ${barColor}80`,
        }} />
      </div>
    </div>
  )
}

// 카드 사용 효과
function CardFlash({ card, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', zIndex: 200,
    }}>
      <div style={{
        textAlign: 'center', animation: 'zoomIn 0.3s ease',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>{card.emoji}</div>
        <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '18px', marginBottom: '4px' }}>{card.name}</div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>스킬 사용! 어둠 -20% ⬇️</div>
      </div>
      <style>{`@keyframes zoomIn { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  )
}

// 정화 완료 화면
function PurificationComplete({ stage, onContinue }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(0,0,0,0.9))',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 300, padding: '24px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '80px', marginBottom: '16px', animation: 'spin 1s ease' }}>✨</div>
      <h2 style={{ color: '#fbbf24', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>정화 완료!</h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
        <MonsterImage src={stage.monster.image} emoji={stage.monster.emoji} size={48} />
        <span style={{ fontSize: '32px', color: 'rgba(255,255,255,0.6)' }}>→</span>
        <MonsterImage src={stage.purificationItem.image} emoji={stage.purificationItem.emoji} size={48} />
      </div>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '6px' }}>
        {stage.monster.name}이(가) 빛을 되찾았어요!
      </p>
      <p style={{ color: '#fbbf24', fontStyle: 'italic', fontSize: '13px', marginBottom: '24px', maxWidth: '320px', lineHeight: '1.6' }}>
        "{stage.monster.monsterQuote}"
      </p>
      <div style={{
        background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)',
        borderRadius: '16px', padding: '16px', marginBottom: '24px', minWidth: '240px',
      }}>
        <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>🎁 정화 아이템 획득!</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
          <MonsterImage src={stage.purificationItem.image} emoji={stage.purificationItem.emoji} size={28} />
        </div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>{stage.purificationItem.name}</div>
      </div>
      <button onClick={onContinue} style={{
        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        border: 'none', borderRadius: '50px', padding: '14px 40px',
        fontSize: '15px', fontWeight: 'bold', color: '#1a1400', cursor: 'pointer',
      }}>
        복도로 돌아가기 🏫
      </button>
      <style>{`@keyframes spin { from { transform: rotate(0deg) scale(0.5); opacity: 0; } to { transform: rotate(360deg) scale(1); opacity: 1; } }`}</style>
    </div>
  )
}

export default function SimulationScreen({ playerData, stageId, actions, onComplete, onAllCleared }) {
  const isMobile = useIsMobile()
  const stage = LUMOS_STAGES.find(s => s.id === stageId)
  const [darkness, setDarkness] = useState(100)
  const [usedCardIds, setUsedCardIds] = useState([])
  const [flashCard, setFlashCard] = useState(null)
  const [activeCard, setActiveCard] = useState(null)
  const [purified, setPurified] = useState(false)
  const pad = isMobile ? 16 : 24

  if (!stage) return null

  const alreadyCleared = playerData?.clearedStages?.includes(stageId)

  const handleUseCard = (card) => {
    if (usedCardIds.includes(card.id) || flashCard || activeCard) return
    setActiveCard(card)
  }

  const handleMinigameSuccess = () => {
    const card = activeCard
    setActiveCard(null)
    setFlashCard(card)
  }

  const handleFlashDone = () => {
    const card = flashCard
    const newUsed = [...usedCardIds, card.id]
    setUsedCardIds(newUsed)
    setFlashCard(null)
    const newDarkness = Math.max(0, 100 - newUsed.length * 20)
    setDarkness(newDarkness)
    if (newDarkness === 0) {
      // 정화 완료
      actions.addExp(stage.exp)
      actions.addCoins(stage.coins)
      actions.updateProgress(stage.progressKey, 25)
      actions.addBadge(`${stage.monster.name} 정화 완료 ${stage.purificationItem.emoji}`)
      actions.clearStage(stageId, stage.purificationItem)
      setTimeout(() => setPurified(true), 500)
    }
  }

  const handlePurificationContinue = () => {
    const totalCleared = (playerData?.clearedStages?.length || 0) + 1
    if (totalCleared >= 8) onAllCleared()
    else onComplete()
  }

  if (alreadyCleared) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #1a1035)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <MonsterImage src={stage.purificationItem.image} emoji={stage.purificationItem.emoji} size={64} />
        </div>
        <h2 style={{ color: '#34d399', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>이미 정화 완료!</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '24px' }}>
          {stage.monster.name}은 이미 빛을 되찾았어요 ✨
        </p>
        <button onClick={onComplete} style={{
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          border: 'none', borderRadius: '50px', padding: '14px 40px',
          fontSize: '14px', fontWeight: 'bold', color: 'white', cursor: 'pointer',
        }}>
          복도로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: stage.backgroundImage
        ? `linear-gradient(180deg, rgba(10,8,25,0.25) 0%, rgba(10,8,25,0.75) 100%), url(${stage.backgroundImage})`
        : 'linear-gradient(180deg, #0f0c29 0%, #1a1035 100%)',
      backgroundSize: 'cover', backgroundPosition: 'center',
      padding: `20px ${pad}px 80px`,
    }}>
      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '2px', marginBottom: '4px' }}>BOSS BATTLE</div>
        <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
          {stage.classroom} — 몬스터 정화
        </h2>
      </div>

      {/* 몬스터 카드 */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: `1px solid ${stage.monster.color}30`,
        borderRadius: '20px', padding: '24px', textAlign: 'center', marginBottom: '24px',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: '12px',
          filter: `drop-shadow(0 0 20px ${stage.monster.color})`,
          opacity: 0.3 + (darkness / 100) * 0.7,
          animation: darkness > 0 ? 'shake 2s ease-in-out infinite' : 'none',
        }}>
          <MonsterImage src={stage.monster.image} emoji={stage.monster.emoji} size={72} />
        </div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '2px' }}>
          {stage.monster.nameEn}
        </div>
        <h3 style={{ color: stage.monster.color || 'white', fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px' }}>
          {stage.monster.name}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '20px' }}>
          {stage.theme} 몬스터
        </p>
        <DarkGauge value={darkness} />
      </div>

      {/* 캐치프레이즈 */}
      <div style={{
        background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
        borderRadius: '14px', padding: '12px 16px', marginBottom: '20px', textAlign: 'center',
      }}>
        <p style={{ color: '#fbbf24', fontSize: '13px', margin: 0, fontStyle: 'italic' }}>
          {stage.catchPhrase}
        </p>
      </div>

      {/* 스킬카드 사용 */}
      <div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
          스킬카드를 순서대로 사용해서 어둠을 정화하세요! ({usedCardIds.length}/5)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {stage.skillCards.map((card) => {
            const used = usedCardIds.includes(card.id)
            return (
              <button
                key={card.id}
                onClick={() => !used && handleUseCard(card)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '14px', border: 'none',
                  background: used
                    ? 'rgba(34,197,94,0.15)'
                    : `linear-gradient(135deg, ${stage.monster.darkColor}80, rgba(255,255,255,0.05))`,
                  outline: !used ? `1px solid ${stage.monster.color}40` : 'none',
                  cursor: used ? 'default' : 'pointer',
                  opacity: 1,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px',
                  background: used ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)',
                }}>
                  {used ? '✅' : card.emoji}
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ color: used ? '#34d399' : 'white', fontWeight: 'bold', fontSize: '13px' }}>
                    {card.name}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
                    {used ? '사용 완료 — 어둠 -20%' : '⚔️ 사용'}
                  </div>
                </div>
                {!used && (
                  <div style={{ color: '#fbbf24', fontSize: '16px' }}>→</div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {activeCard && (
        <MinigameRouter
          card={activeCard}
          onSuccess={handleMinigameSuccess}
          onCancel={() => setActiveCard(null)}
        />
      )}
      {flashCard && <CardFlash card={flashCard} onDone={handleFlashDone} />}
      {purified && <PurificationComplete stage={stage} onContinue={handlePurificationContinue} />}

      <style>{`
        @keyframes shake {
          0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)}
        }
        @keyframes pulse {
          0%,100%{opacity:1} 50%{opacity:0.4}
        }
      `}</style>
    </div>
  )
}
