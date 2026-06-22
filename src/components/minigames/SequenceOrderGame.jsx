import { useState } from 'react'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

// 순서가 뒤섞인 항목들을 정답 순서대로 차례차례 탭하는 게임
export default function SequenceOrderGame({ config, onSuccess, onFail }) {
  const { items, correctOrder } = config
  const [shuffled] = useState(() => shuffle(items))
  const [picked, setPicked] = useState([])

  const handlePick = (id) => {
    if (picked.includes(id)) return
    const nextIdx = picked.length
    if (id !== correctOrder[nextIdx]) {
      onFail()
      return
    }
    const newPicked = [...picked, id]
    setPicked(newPicked)
    if (newPicked.length === correctOrder.length) onSuccess()
  }

  return (
    <div style={{ padding: '8px 4px' }}>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
        순서대로 하나씩 탭해요 ({picked.length}/{correctOrder.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {shuffled.map(item => {
          const order = picked.indexOf(item.id)
          const done = order !== -1
          return (
            <button key={item.id} onClick={() => handlePick(item.id)} disabled={done} style={{
              padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '13px',
              textAlign: 'left', cursor: done ? 'default' : 'pointer',
              background: done ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.08)',
              color: done ? '#34d399' : 'white', fontWeight: 'bold',
            }}>
              {done && `${order + 1}. `}{item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
