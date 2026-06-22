import { useState } from 'react'
import TapTimingGame from './TapTimingGame'
import HoldGaugeGame from './HoldGaugeGame'
import RhythmTapGame from './RhythmTapGame'
import DragAvoidGame from './DragAvoidGame'
import MatchPairsGame from './MatchPairsGame'
import ChoiceGame from './ChoiceGame'
import SequenceOrderGame from './SequenceOrderGame'
import TypeInputGame from './TypeInputGame'
import { getWrongFeedback } from '../../utils/wrongFeedback'

const ENGINES = {
  TAP_TIMING: TapTimingGame,
  HOLD_GAUGE: HoldGaugeGame,
  RHYTHM_TAP: RhythmTapGame,
  DRAG_AVOID: DragAvoidGame,
  MATCH_PAIRS: MatchPairsGame,
  CHOICE: ChoiceGame,
  SEQUENCE_ORDER: SequenceOrderGame,
  TYPE_INPUT: TypeInputGame,
}

export default function MinigameRouter({ card, onSuccess, onCancel }) {
  const [wrongCount, setWrongCount] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [gameKey, setGameKey] = useState(0)

  const Engine = ENGINES[card.gameType] || ChoiceGame

  const handleFail = () => {
    setFeedback(getWrongFeedback(card, wrongCount))
    setWrongCount(c => c + 1)
    setGameKey(k => k + 1) // 실패 시 미니게임 상태 초기화(재도전)
    setTimeout(() => setFeedback(null), 1800)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 250, padding: '20px',
    }}>
      <div style={{
        background: 'linear-gradient(160deg, #1a1035, #0f0c29)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px', padding: '24px', maxWidth: '380px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '32px', marginBottom: '6px' }}>{card.emoji}</div>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#fbbf24', fontWeight: 'bold' }}>{card.name}</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '6px', lineHeight: '1.5' }}>
            {card.description}
          </p>
        </div>

        <Engine key={gameKey} config={card.gameConfig || {}} card={card} onSuccess={onSuccess} onFail={handleFail} />

        {feedback && (
          <div style={{
            background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)',
            borderRadius: '12px', padding: '10px 14px', marginTop: '12px',
          }}>
            <p style={{ margin: 0, color: '#fbbf24', fontSize: '12px', lineHeight: '1.5' }}>{feedback}</p>
          </div>
        )}

        <button onClick={onCancel} style={{
          marginTop: '14px', width: '100%', padding: '8px', background: 'none',
          border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px',
          color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '12px',
        }}>
          나중에 다시 시도할게요
        </button>
      </div>
    </div>
  )
}
