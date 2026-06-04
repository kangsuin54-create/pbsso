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
      background: 'white', borderTop: '2px solid #e5e7eb',
      display: 'flex', zIndex: 200,
      boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {NAV_ITEMS.map(item => {
        const active = current === item.key
        return (
          <button key={item.key} onClick={() => onNavigate(item.key)} style={{
            flex: 1, border: 'none', background: 'transparent',
            padding: '10px 4px 8px',
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '2px', transition: 'all 0.2s',
          }}>
            <span style={{
              fontSize: '24px', lineHeight: 1,
              filter: active ? 'none' : 'grayscale(0.5) opacity(0.6)',
              transform: active ? 'scale(1.15)' : 'scale(1)',
              transition: 'all 0.2s',
            }}>{item.emoji}</span>
            <span style={{
              fontSize: '10px', fontWeight: active ? 'bold' : 'normal',
              color: active ? '#1d4ed8' : '#9ca3af',
            }}>{item.label}</span>
            {active && (
              <div style={{
                position: 'absolute', bottom: 0, width: '40px', height: '3px',
                background: 'linear-gradient(90deg, #059669, #1d4ed8)',
                borderRadius: '99px 99px 0 0',
              }} />
            )}
          </button>
        )
      })}
    </div>
  )
}
