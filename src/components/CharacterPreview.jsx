import { useState } from 'react'

// 이미지 로드 실패 시 이모지로 폴백
function ItemLayer({ src, alt, emoji, style }) {
  const [err, setErr] = useState(false)
  if (err) {
    return (
      <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: parseInt(style.width) * 0.55 || 24 }}>
        {emoji}
      </div>
    )
  }
  return (
    <img
      src={src} alt={alt}
      style={style}
      onError={() => setErr(true)}
    />
  )
}

function CharacterLayer({ src, gender, style }) {
  const [err, setErr] = useState(false)
  if (err) {
    return (
      <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
        {gender === 'female' ? '👧' : '👦'}
      </div>
    )
  }
  return <img src={src} alt="캐릭터" style={style} onError={() => setErr(true)} />
}

export default function CharacterPreview({ equipped, size = 'md', playerData, gender = 'male' }) {
  const { hat, accessory, companion, background } = equipped || {}
  const isLg = size === 'lg'
  const W = isLg ? 220 : 160
  const H = isLg ? 260 : 190

  const bgStyle = background?.bg
    ? { background: background.bg }
    : { background: 'linear-gradient(180deg, #e0f2fe 0%, #bbf7d0 100%)' }

  return (
    <div style={{
      position: 'relative', width: W, height: H,
      borderRadius: isLg ? '20px' : '16px', overflow: 'hidden',
      border: '3px solid rgba(255,255,255,0.9)',
      boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
      margin: '0 auto', flexShrink: 0,
    }}>
      {/* 배경 */}
      {background ? (
        <ItemLayer
          src={`/items/${background.id}.jpg`} alt={background.name} emoji={background.emoji}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, ...bgStyle }} />
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.15)' }} />

      {/* 동반자 */}
      {companion && (
        <ItemLayer
          src={`/items/${companion.id}.jpg`} alt={companion.name} emoji={companion.emoji}
          style={{
            position: 'absolute', left: 2, bottom: 6,
            width: isLg ? 76 : 55, height: isLg ? 76 : 55,
            objectFit: 'contain', mixBlendMode: 'multiply',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          }}
        />
      )}

      {/* 모자 */}
      {hat && (
        <ItemLayer
          src={`/items/${hat.id}.jpg`} alt={hat.name} emoji={hat.emoji}
          style={{
            position: 'absolute', top: isLg ? 2 : 1, left: '50%', transform: 'translateX(-50%)',
            width: isLg ? 90 : 66, height: isLg ? 68 : 50,
            objectFit: 'contain', mixBlendMode: 'multiply',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))', zIndex: 5,
          }}
        />
      )}

      {/* 메인 캐릭터 */}
      <CharacterLayer
        src={`/items/character_${gender}.jpg`} gender={gender}
        style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: isLg ? 150 : 110, height: isLg ? 200 : 148,
          objectFit: 'contain', mixBlendMode: 'multiply', zIndex: 3,
        }}
      />

      {/* 액세서리 */}
      {accessory && (
        <ItemLayer
          src={`/items/${accessory.id}.jpg`} alt={accessory.name} emoji={accessory.emoji}
          style={{
            position: 'absolute', bottom: isLg ? 40 : 30, left: '50%', transform: 'translateX(-50%)',
            width: isLg ? 64 : 46, height: isLg ? 64 : 46,
            objectFit: 'contain', mixBlendMode: 'multiply',
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))', zIndex: 6,
          }}
        />
      )}

      {/* 레벨 뱃지 */}
      {playerData && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          background: 'rgba(255,255,255,0.95)', borderRadius: '99px',
          padding: '2px 8px', fontSize: '11px', fontWeight: 'bold', color: '#1d4ed8',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)', zIndex: 10,
        }}>
          Lv.{playerData.level}
        </div>
      )}
    </div>
  )
}
