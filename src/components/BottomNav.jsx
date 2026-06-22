const NAV_ITEMS = [
  { key: 'home', emoji: '🏠', label: '홈' },
  { key: 'stage_select', emoji: '⚔️', label: '퀘스트' },
  { key: 'shop', emoji: '🛍️', label: '상점' },
  { key: 'mypage', emoji: '👤', label: '마이페이지' },
]

export default function BottomNav({ current, onNavigate }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'linear-gradient(180deg, #1a1035, #0a0818)',
      borderTop: '1px solid rgba(251,191,36,0.15)',
      display: 'flex', zIndex: 200,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {NAV_ITEMS.map(item => {
        const active = current === item.key
        return (
          <button key={item.key} onClick={() => onNavigate(item.key)} style={{
            flex: 1, border: 'none', background: 'transparent', position: 'relative',
            padding: '10px 4px 8px',
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '2px', transition: 'all 0.2s',
          }}>
            <span style={{
              fontSize: '24px', lineHeight: 1,
              filter: active ? 'drop-shadow(0 0 6px rgba(251,191,36,0.7))' : 'grayscale(0.6) opacity(0.5)',
              transform: active ? 'scale(1.15)' : 'scale(1)',
              transition: 'all 0.2s',
            }}>{item.emoji}</span>
            <span style={{
              fontSize: '10px', fontWeight: active ? 'bold' : 'normal',
              color: active ? '#fbbf24' : 'rgba(255,255,255,0.4)',
            }}>{item.label}</span>
            {active && (
              <div style={{
                position: 'absolute', bottom: 0, width: '40px', height: '3px',
                background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                borderRadius: '99px 99px 0 0',
                boxShadow: '0 0 8px rgba(251,191,36,0.6)',
              }} />
            )}
          </button>
        )
      })}
    </div>
  )
}
