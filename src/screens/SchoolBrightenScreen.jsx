import { useState, useEffect } from 'react'

export default function SchoolBrightenScreen({ onContinue }) {
  const [bright, setBright] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBright(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/school/exterior_dark.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/school/exterior_bright.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: bright ? 1 : 0,
        transition: 'opacity 2.5s ease',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(10,8,25,0.15) 0%, rgba(10,8,25,0.75) 100%)',
      }} />

      <div style={{
        position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end', padding: '40px 24px', textAlign: 'center',
      }}>
        <img
          src="/lumos-crystal.png"
          alt="루모스 크리스탈"
          style={{
            width: '160px', height: '160px', objectFit: 'contain',
            marginBottom: '16px',
            opacity: bright ? 1 : 0, transform: bright ? 'scale(1)' : 'scale(0.5)',
            transition: 'all 1.5s ease 0.5s',
            filter: 'drop-shadow(0 0 40px #fbbf24) drop-shadow(0 0 20px rgba(251,191,36,0.6))',
          }}
        />
        <h1 style={{
          color: '#fbbf24', fontSize: '26px', fontWeight: '900', marginBottom: '12px',
          textShadow: '0 2px 16px rgba(251,191,36,0.6)',
          opacity: bright ? 1 : 0, transition: 'opacity 1.5s ease 1s',
        }}>
          L.U.M.O.S!
        </h1>
        <p style={{
          color: 'white', fontSize: '15px', lineHeight: '1.8', marginBottom: '32px', maxWidth: '340px',
          opacity: bright ? 1 : 0, transition: 'opacity 1.5s ease 1.3s',
        }}>
          8마리의 마음 몬스터가 모두 빛으로 깨어났어요.
          <br />꺼졌던 학교의 불이 다시 환하게 켜졌습니다.
          <br />이제 학교는 서로를 아끼는 빛의 공간이에요. 🌈
        </p>
        <button
          onClick={onContinue}
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#1a1400',
            border: 'none', borderRadius: '99px', padding: '16px 44px',
            fontSize: '16px', fontWeight: '900', cursor: 'pointer',
            boxShadow: '0 0 30px rgba(251,191,36,0.5)',
            opacity: bright ? 1 : 0, transition: 'opacity 1.5s ease 1.6s',
          }}
        >
          📊 결과 보기
        </button>
      </div>
    </div>
  )
}
