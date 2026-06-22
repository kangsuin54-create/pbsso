import { useState } from 'react'

// 자기표현 글쓰기 — 정답이 정해져 있지 않아 일정 길이 이상 입력하면 성공으로 인정
export default function TypeInputGame({ config, onSuccess, onFail }) {
  const { prompt, placeholder = '여기에 적어봐요...', minLength = 2 } = config
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (text.trim().length >= minLength) onSuccess()
    else onFail()
  }

  return (
    <div style={{ padding: '8px 4px' }}>
      {prompt && (
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', textAlign: 'center' }}>
          {prompt}
        </p>
      )}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{
          width: '100%', boxSizing: 'border-box', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.06)', color: 'white', padding: '12px', fontSize: '13px',
          resize: 'none', marginBottom: '12px',
        }}
      />
      <button onClick={handleSubmit} style={{
        width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#1a1400',
        fontWeight: 'bold', fontSize: '15px', cursor: 'pointer',
      }}>
        전하기 💌
      </button>
    </div>
  )
}
