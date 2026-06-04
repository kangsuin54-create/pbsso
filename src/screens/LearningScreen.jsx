import { useState, useEffect } from 'react'
import { LUMOS_STAGES } from '../data/lumosStages'
import useIsMobile from '../hooks/useIsMobile'

function WrongFeedback({ message }) {
  return (
    <div style={{
      background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '12px',
      padding: '12px 16px', marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: '18px' }}>🌟</span>
      <p style={{ margin: 0, color: '#92400e', fontSize: '13px', lineHeight: '1.5' }}>{message}</p>
    </div>
  )
}

function QuizModal({ card, onSuccess, onClose }) {
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

  const feedbackMsg = card.wrongFeedback?.[Math.min(wrongCount, 2)] || '다시 한번 생각해봐요~ 😊'

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px',
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '24px', maxWidth: '420px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>{card.emoji}</div>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#1f2937', fontWeight: 'bold' }}>
            {card.name} — 퀴즈!
          </h3>
        </div>
        <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', marginBottom: '16px', textAlign: 'center' }}>
          {card.quiz.question}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {card.quiz.choices.map((choice, i) => {
            let bg = 'white', borderColor = '#e5e7eb', color = '#374151'
            if (submitted) {
              if (i === card.quiz.correct) { bg = '#d1fae5'; borderColor = '#34d399'; color = '#065f46' }
              else if (i === selected) { bg = '#fef3c7'; borderColor = '#fbbf24'; color = '#92400e' }
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} style={{
                padding: '12px 16px', border: `1.5px solid ${borderColor}`, borderRadius: '12px',
                background: bg, color, fontSize: '13px', cursor: submitted ? 'default' : 'pointer',
                textAlign: 'left', transition: 'all 0.2s',
              }}>
                {choice}
              </button>
            )
          })}
        </div>
        {submitted && selected !== card.quiz.correct && <WrongFeedback message={feedbackMsg} />}
        <button onClick={onClose} style={{
          marginTop: '16px', width: '100%', padding: '10px', background: 'none',
          border: '1px solid #e5e7eb', borderRadius: '10px', color: '#9ca3af', cursor: 'pointer', fontSize: '13px',
        }}>
          나중에 다시 볼게요
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

export default function LearningScreen({ stageId, actions, onComplete }) {
  const isMobile = useIsMobile()
  const stage = LUMOS_STAGES.find(s => s.id === stageId)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [learnedIds, setLearnedIds] = useState([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [showReward, setShowReward] = useState(null)
  const [allDone, setAllDone] = useState(false)

  if (!stage) return null

  const card = stage.skillCards[currentIdx]
  const totalCards = stage.skillCards.length
  const isLearned = (id) => learnedIds.includes(id)
  const pad = isMobile ? 16 : 24

  const handleQuizSuccess = () => {
    setShowQuiz(false)
    actions.addExp(10)
    actions.addCoins(5)
    actions.updateProgress(stage.progressKey, 8)
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
        <div style={{ fontSize: '80px', marginBottom: '24px', animation: 'bounce 1s infinite' }}>🌟</div>
        <h2 style={{ color: '#fbbf24', fontSize: '22px', fontWeight: 'bold', marginBottom: '12px' }}>스킬카드 5장 완성!</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>
          {stage.monster.name}에 맞설 준비가 됐어요!
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
          ⚔️ {stage.monster.name} 정화하러 가기!
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
          <span style={{ fontSize: '20px' }}>{stage.monster.emoji}</span>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: 'bold' }}>{stage.classroom}</span>
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
          <button key={c.id} onClick={() => { setCurrentIdx(i); setFlipped(false) }} style={{
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

      {/* 메인 카드 */}
      <div
        onClick={() => !isLearned(card.id) && setFlipped(f => !f)}
        style={{
          borderRadius: '20px', minHeight: '280px', padding: '24px',
          cursor: isLearned(card.id) ? 'default' : 'pointer',
          background: flipped
            ? `linear-gradient(135deg, ${stage.monster.darkColor}, rgba(0,0,0,0.5))`
            : 'rgba(255,255,255,0.05)',
          border: `1px solid ${stage.monster.color}30`,
          transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
        }}
      >
        {isLearned(card.id) ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '240px' }}>
            <div style={{ fontSize: '48px' }}>✅</div>
            <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: '14px', marginTop: '8px' }}>완료!</div>
          </div>
        ) : !flipped ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>{card.emoji}</div>
              <h3 style={{ color: stage.monster.color || '#fbbf24', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px' }}>{card.name}</h3>
              <div style={{ display: 'inline-block', background: `${stage.monster.color}20`, borderRadius: '20px', padding: '3px 10px' }}>
                <span style={{ color: stage.monster.color, fontSize: '11px', fontWeight: 'bold' }}>스킬 {currentIdx + 1}/{totalCards}</span>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.7', textAlign: 'center' }}>{card.description}</p>
            <div style={{ textAlign: 'center', marginTop: '20px', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>탭하여 퀴즈 도전 →</div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
            <h3 style={{ color: '#fbbf24', fontSize: '16px', marginBottom: '12px' }}>이해했나요?</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '24px' }}>{card.name}에 대한 짧은 퀴즈를 풀어봐요!</p>
            <button
              onClick={(e) => { e.stopPropagation(); setShowQuiz(true) }}
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                border: 'none', borderRadius: '30px', padding: '12px 32px',
                fontSize: '14px', fontWeight: 'bold', color: '#1a1400', cursor: 'pointer',
              }}
            >
              퀴즈 풀기 ✍️
            </button>
          </div>
        )}
      </div>

      {/* 다음 카드 */}
      {isLearned(card.id) && currentIdx < totalCards - 1 && (
        <button onClick={() => { setCurrentIdx(i => i + 1); setFlipped(false) }} style={{
          marginTop: '16px', width: '100%', padding: '14px',
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          border: 'none', borderRadius: '14px', color: 'white',
          fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
        }}>
          다음 스킬카드 →
        </button>
      )}

      {showQuiz && <QuizModal card={card} onSuccess={handleQuizSuccess} onClose={() => { setShowQuiz(false); setFlipped(false) }} />}
      {showReward && <RewardPopup card={showReward} onClose={() => setShowReward(null)} />}
    </div>
  )
}
