import { useState, useEffect } from 'react'
import { LUMOS_STAGES } from '../data/lumosStages'
import useIsMobile from '../hooks/useIsMobile'
import MonsterImage from '../components/MonsterImage'
import { getWrongFeedback } from '../utils/wrongFeedback'

function WrongFeedback({ message }) {
  return (
    <div style={{
      background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '12px',
      padding: '12px 16px', marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: '18px' }}>🌟</span>
      <p style={{ margin: 0, color: '#fbbf24', fontSize: '13px', lineHeight: '1.5' }}>{message}</p>
    </div>
  )
}

// 대화 선택지 모달 — 기존 퀴즈 로직을 NPC와의 대화 형식으로 재스킨
function DialogueChoiceModal({ stage, card, onSuccess, onClose }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [wrongCount, setWrongCount] = useState(0)

  const handleSelect = (idx) => {
    if (submitted) return
    setSelected(idx)
    setSubmitted(true)
    if (idx === card.quiz.correct) {
      setTimeout(onSuccess, 1200)
    } else {
      setWrongCount(c => c + 1)
      setTimeout(() => { setSelected(null); setSubmitted(false) }, 1800)
    }
  }

  const feedbackMsg = getWrongFeedback(card, wrongCount)

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px',
    }}>
      <div style={{
        background: 'linear-gradient(160deg, #1a1035, #0f0c29)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px', padding: '24px', maxWidth: '420px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <MonsterImage src={stage.npcImage} emoji="🧑" size={56} />
          <h3 style={{ margin: '8px 0 0', fontSize: '15px', color: '#fbbf24', fontWeight: 'bold' }}>
            {stage.npc}의 질문
          </h3>
        </div>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', marginBottom: '16px', textAlign: 'center' }}>
          {card.quiz.question}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {card.quiz.choices.map((choice, i) => {
            let bg = 'rgba(255,255,255,0.06)', borderColor = 'rgba(255,255,255,0.15)', color = 'white'
            if (submitted) {
              if (i === card.quiz.correct) { bg = 'rgba(52,211,153,0.2)'; borderColor = '#34d399'; color = '#34d399' }
              else if (i === selected) { bg = 'rgba(251,191,36,0.2)'; borderColor = '#fbbf24'; color = '#fbbf24' }
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} style={{
                padding: '12px 16px', border: `1.5px solid ${borderColor}`, borderRadius: '12px',
                background: bg, color, fontSize: '13px', cursor: submitted ? 'default' : 'pointer',
                textAlign: 'left', transition: 'all 0.2s',
              }}>
                "{choice}"
              </button>
            )
          })}
        </div>
        {submitted && selected !== card.quiz.correct && <WrongFeedback message={feedbackMsg} />}
        <button onClick={onClose} style={{
          marginTop: '16px', width: '100%', padding: '10px', background: 'none',
          border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '13px',
        }}>
          나중에 다시 대화할게요
        </button>
      </div>
    </div>
  )
}

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

export default function NpcDialogueScreen({ stageId, actions, onComplete }) {
  const isMobile = useIsMobile()
  const stage = LUMOS_STAGES.find(s => s.id === stageId)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showChoices, setShowChoices] = useState(false)
  const [learnedIds, setLearnedIds] = useState([])
  const [showReward, setShowReward] = useState(null)
  const [allDone, setAllDone] = useState(false)
  const pad = isMobile ? 16 : 24

  if (!stage) return null

  const card = stage.skillCards[currentIdx]
  const totalCards = stage.skillCards.length
  const isLearned = (id) => learnedIds.includes(id)

  const handleDialogueSuccess = () => {
    setShowChoices(false)
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

  if (allDone) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #1a1035)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <MonsterImage src={stage.npcImage} emoji="🧑" size={80} />
        <h2 style={{ color: '#fbbf24', fontSize: '22px', fontWeight: 'bold', margin: '20px 0 12px' }}>
          {stage.npc}: "준비됐어요!"
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>
          {stage.monster.name}에 맞설 스킬카드 5장을 모두 받았어요!
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
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f0c29 0%, #1a1035 100%)', padding: `20px ${pad}px 80px` }}>
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

      {/* NPC 대화창 */}
      <div style={{
        borderRadius: '20px', minHeight: '300px', padding: '24px',
        background: `linear-gradient(135deg, ${stage.monster.darkColor}60, rgba(0,0,0,0.4))`,
        border: `1px solid ${stage.monster.color}30`,
      }}>
        {isLearned(card.id) ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
            <div style={{ fontSize: '48px' }}>✅</div>
            <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: '14px', marginTop: '8px' }}>대화 완료!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MonsterImage src={stage.npcImage} emoji="🧑" size={88} style={{ marginBottom: '8px' }} />
            <div style={{ color: stage.monster.color, fontWeight: 'bold', fontSize: '13px', marginBottom: '14px' }}>
              {stage.npc}
            </div>
            {/* 말풍선 */}
            <div style={{
              position: 'relative', background: 'rgba(255,255,255,0.95)', borderRadius: '16px',
              padding: '16px 18px', maxWidth: '320px', marginBottom: '16px',
            }}>
              <div style={{
                position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)',
                width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
                borderBottom: '8px solid rgba(255,255,255,0.95)',
              }} />
              <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: '1.6', textAlign: 'center' }}>
                "{card.description}"
              </p>
            </div>
            <div style={{ display: 'inline-block', background: `${stage.monster.color}20`, borderRadius: '20px', padding: '3px 12px', marginBottom: '16px' }}>
              <span style={{ color: stage.monster.color, fontSize: '11px', fontWeight: 'bold' }}>
                스킬 {currentIdx + 1}/{totalCards} · {card.name}
              </span>
            </div>
            <button
              onClick={() => setShowChoices(true)}
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                border: 'none', borderRadius: '30px', padding: '12px 32px',
                fontSize: '14px', fontWeight: 'bold', color: '#1a1400', cursor: 'pointer',
              }}
            >
              💬 대화하기
            </button>
          </div>
        )}
      </div>

      {showChoices && (
        <DialogueChoiceModal stage={stage} card={card} onSuccess={handleDialogueSuccess} onClose={() => setShowChoices(false)} />
      )}
      {showReward && <RewardPopup card={showReward} onClose={() => setShowReward(null)} />}
    </div>
  )
}
