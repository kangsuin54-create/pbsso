import useIsMobile from '../hooks/useIsMobile'

export default function StatusBar({ playerData }) {
  const isMobile = useIsMobile()
  const expPercent = playerData.exp % 100

  return (
    <div style={{
      background: 'white',
      borderBottom: '3px solid #86efac',
      padding: isMobile ? '8px 12px' : '10px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '8px' : '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* 캐릭터 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <span style={{ fontSize: isMobile ? '20px' : '24px' }}>🧙</span>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: isMobile ? '12px' : '14px', color: '#1e40af', maxWidth: isMobile ? '70px' : '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {playerData.name}
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>Lv.{playerData.level}</div>
        </div>
      </div>

      {/* EXP 바 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280', marginBottom: '3px' }}>
          <span>⭐ EXP</span>
          <span>{playerData.exp % 100}/100</span>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: '99px', height: '7px', overflow: 'hidden' }}>
          <div style={{
            background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
            width: `${expPercent}%`,
            height: '100%',
            borderRadius: '99px',
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* 팀포인트 */}
      <div style={{
        background: '#eff6ff', borderRadius: '10px',
        padding: isMobile ? '3px 8px' : '4px 12px',
        fontSize: isMobile ? '11px' : '13px',
        fontWeight: 'bold', color: '#1d4ed8',
        border: '2px solid #bfdbfe', flexShrink: 0,
      }}>
        🤝 {playerData.teamPoints}
      </div>

      {/* 코인 */}
      <div style={{
        background: '#fef3c7', borderRadius: '10px',
        padding: isMobile ? '3px 8px' : '4px 12px',
        fontSize: isMobile ? '11px' : '13px',
        fontWeight: 'bold', color: '#92400e',
        border: '2px solid #fcd34d', flexShrink: 0,
      }}>
        🪙 {playerData.coins || 0}
      </div>

      {/* 배지 */}
      <div style={{
        background: '#fdf4ff', borderRadius: '10px',
        padding: isMobile ? '3px 8px' : '4px 12px',
        fontSize: isMobile ? '11px' : '13px',
        fontWeight: 'bold', color: '#7e22ce',
        border: '2px solid #e9d5ff', flexShrink: 0,
      }}>
        🏅 {playerData.badges.length}
      </div>
    </div>
  )
}