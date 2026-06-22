import { useState } from 'react'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

// 좌/우 항목을 번갈아 선택해 짝을 맞추는 게임. 전부 맞추면 성공.
export default function MatchPairsGame({ config, onSuccess, onFail }) {
  const { pairs } = config
  const [lefts] = useState(() => shuffle(pairs))
  const [rights] = useState(() => shuffle(pairs))
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [matched, setMatched] = useState([])

  const pickLeft = (id) => { if (!matched.includes(id)) setSelectedLeft(id) }

  const pickRight = (id) => {
    if (matched.includes(id) || selectedLeft === null) return
    if (selectedLeft === id) {
      const newMatched = [...matched, id]
      setMatched(newMatched)
      setSelectedLeft(null)
      if (newMatched.length === pairs.length) onSuccess()
    } else {
      setSelectedLeft(null)
      onFail()
    }
  }

  return (
    <div style={{ display: 'flex', gap: '10px', padding: '8px 4px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {lefts.map(p => (
          <button key={p.id} onClick={() => pickLeft(p.id)} disabled={matched.includes(p.id)} style={{
            padding: '10px', borderRadius: '10px', border: 'none', fontSize: '12px', cursor: 'pointer',
            background: matched.includes(p.id) ? 'rgba(52,211,153,0.2)' : selectedLeft === p.id ? '#fbbf24' : 'rgba(255,255,255,0.08)',
            color: matched.includes(p.id) ? '#34d399' : selectedLeft === p.id ? '#1a1400' : 'white',
            fontWeight: 'bold',
          }}>
            {p.left}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rights.map(p => (
          <button key={p.id} onClick={() => pickRight(p.id)} disabled={matched.includes(p.id)} style={{
            padding: '10px', borderRadius: '10px', border: 'none', fontSize: '12px', cursor: 'pointer',
            background: matched.includes(p.id) ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.08)',
            color: matched.includes(p.id) ? '#34d399' : 'white',
            fontWeight: 'bold',
          }}>
            {p.right}
          </button>
        ))}
      </div>
    </div>
  )
}
