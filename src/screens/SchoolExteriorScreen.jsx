export default function SchoolExteriorScreen({ onEnter }) {
  return (
    <div
      onClick={onEnter}
      style={{
        minHeight: '100vh', position: 'relative', cursor: 'pointer',
        backgroundImage: 'linear-gradient(180deg, rgba(10,8,25,0.35) 0%, rgba(10,8,25,0.85) 100%), url(/school/exterior_dark.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
        padding: '40px 24px', textAlign: 'center',
      }}
    >
      <div style={{ color: '#a78bfa', fontSize: '11px', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '8px' }}>
        L.U.M.O.S
      </div>
      <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '900', marginBottom: '12px', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
        그림자 안개에 휩싸인 학교
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px', maxWidth: '340px' }}>
        모든 불이 꺼진 학교 안에 8마리 마음 몬스터가 숨어있어요.
        <br />문을 열고 들어가 정화를 시작해봐요.
      </p>
      <button
        onClick={(e) => { e.stopPropagation(); onEnter() }}
        style={{
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#1a1400',
          border: 'none', borderRadius: '99px', padding: '16px 44px',
          fontSize: '17px', fontWeight: '900', cursor: 'pointer',
          boxShadow: '0 0 30px rgba(251,191,36,0.5)', letterSpacing: '1px',
        }}
      >
        🚪 학교 안으로 들어가기
      </button>
    </div>
  )
}
