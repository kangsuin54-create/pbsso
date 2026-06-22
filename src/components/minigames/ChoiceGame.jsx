import { useState } from 'react'

// 기존 card.quiz 필드를 그대로 재사용하는 객관식 게임
export default function ChoiceGame({ card, onSuccess, onFail }) {
  const [selected, setSelected] = useState(null)
  const quiz = card.quiz

  const handleSelect = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    if (idx === quiz.correct) {
      setTimeout(onSuccess, 700)
    } else {
      setTimeout(() => { setSelected(null); onFail() }, 900)
    }
  }

  return (
    <div style={{ padding: '8px 4px' }}>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', marginBottom: '14px', textAlign: 'center' }}>
        {quiz.question}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {quiz.choices.map((choice, i) => {
          let bg = 'rgba(255,255,255,0.06)', color = 'white'
          if (selected !== null) {
            if (i === quiz.correct) { bg = 'rgba(52,211,153,0.25)'; color = '#34d399' }
            else if (i === selected) { bg = 'rgba(251,191,36,0.25)'; color = '#fbbf24' }
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} style={{
              padding: '12px 16px', border: 'none', borderRadius: '12px',
              background: bg, color, fontSize: '13px', cursor: selected !== null ? 'default' : 'pointer',
              textAlign: 'left',
            }}>
              {choice}
            </button>
          )
        })}
      </div>
    </div>
  )
}
