import { useEffect, useCallback } from 'react'

export default function MinigameIframe({ card, onSuccess, onCancel }) {
  const handleMessage = useCallback((e) => {
    if (e.data?.type === 'MINIGAME_COMPLETE' && e.data.success) {
      onSuccess()
    }
  }, [onSuccess])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.92)',
      zIndex: 250,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'rgba(10,14,39,0.95)',
        borderBottom: '1px solid rgba(244,201,93,0.2)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{card.emoji}</span>
          <span style={{ color: '#f4c95d', fontWeight: 'bold', fontSize: '14px' }}>{card.name}</span>
        </div>
        <button
          onClick={onCancel}
          style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.5)', borderRadius: '20px',
            padding: '4px 14px', fontSize: '12px', cursor: 'pointer',
          }}
        >
          나중에
        </button>
      </div>

      {/* 게임 iframe */}
      <iframe
        src={`/minigames/${card.id}.html`}
        style={{ flex: 1, border: 'none', width: '100%' }}
        title={card.name}
        allow="autoplay"
      />
    </div>
  )
}
