import { LUMOS_STAGES } from '../data/lumosStages'

/*
  스크린샷 분석 기준 위치 보정
  컨테이너: 200×270 / 캐릭터 이미지: top=35, 200×200
  캐릭터 이미지 안에서 마법사 모자 꼭대기: y≈5%=10px → 컨테이너 y≈45
  마법사 모자 전체 영역: 컨테이너 y≈45~105
  눈 레벨: y≈125  /  가슴: y≈160
*/

const POS = {
  // 모자 — 마법사 모자 위에 덮어씌우도록 크게, 높이 조정
  hat_baseball:  { top: 40, left: 44, w: 112, h: 74 },
  hat_tophat:    { top: 32, left: 48, w: 104, h: 82 },
  hat_grad:      { top: 36, left: 46, w: 108, h: 76 },
  hat_crown:     { top: 46, left: 48, w: 104, h: 64 },
  hat_wizard:    { top: 28, left: 40, w: 120, h: 90 },
  hat_santa:     { top: 38, left: 44, w: 112, h: 76 },

  // 액세서리 — 눈(y≈125) / 목(y≈148) / 가슴(y≈160)
  acc_glasses:    { top:112, left: 54, w: 92, h: 38 },
  acc_sunglasses: { top:112, left: 54, w: 92, h: 38 },
  acc_ribbon:     { top: 44, left: 56, w: 88, h: 56 },
  acc_necklace:   { top:152, left: 60, w: 80, h: 62 },
  acc_bow:        { top:144, left: 64, w: 72, h: 46 },
  acc_medal:      { top:152, left: 62, w: 76, h: 66 },

  // 동반자 — 오른쪽 하단
  pet_cat:     { top:158, left:124, w: 72, h: 94 },
  pet_dog:     { top:162, left:124, w: 72, h: 90 },
  pet_dragon:  { top:148, left:118, w: 80, h:106 },
  pet_unicorn: { top:150, left:118, w: 80, h:104 },
  pet_star:    { top:164, left:126, w: 68, h: 84 },
  pet_robot:   { top:154, left:122, w: 74, h: 98 },
}

// 배경별 테마 색상 (이미지 대신 그라디언트로 프레임 표현)
const BG_THEMES = {
  bg_rainbow: { grad: 'linear-gradient(135deg,#ffecd2,#fcb69f)', border: '#fb923c' },
  bg_star:    { grad: 'linear-gradient(135deg,#1e1b4b,#4c1d95)', border: '#818cf8' },
  bg_flower:  { grad: 'linear-gradient(135deg,#fce7f3,#f9a8d4)', border: '#ec4899' },
  bg_ocean:   { grad: 'linear-gradient(135deg,#0c4a6e,#0284c7)', border: '#38bdf8' },
  bg_forest:  { grad: 'linear-gradient(135deg,#14532d,#15803d)', border: '#4ade80' },
  bg_fire:    { grad: 'linear-gradient(135deg,#7f1d1d,#c2410c)', border: '#f97316' },
}

function ItemOverlay({ item, scale }) {
  if (!item || !POS[item.id]) return null
  const p = POS[item.id]
  return (
    <img
      src={`/items/${item.id}.jpg`}
      alt={item.name}
      onError={e => { e.target.style.display = 'none' }}
      style={{
        position:      'absolute',
        top:           p.top  * scale,
        left:          p.left * scale,
        width:         p.w    * scale,
        height:        p.h    * scale,
        objectFit:     'contain',
        mixBlendMode:  'multiply',
        pointerEvents: 'none',
        zIndex:        10,
      }}
    />
  )
}

export default function CharacterSVG({ equipped, gender = 'male', size = 'md', playerData }) {
  const { hat, accessory, companion, background } = equipped || {}
  const isLg  = size === 'lg'
  const scale = isLg ? 1 : 0.72
  const W     = Math.round(200 * scale)
  const H     = Math.round(270 * scale)

  const allCleared = (playerData?.clearedStages?.length || 0) >= LUMOS_STAGES.length
  const charPrefix = allCleared ? 'avatar' : 'character'
  const charSrc = `/items/${charPrefix}_${gender === 'female' ? 'female' : 'male'}.jpg`
  const bgTheme = background ? BG_THEMES[background.id] : null

  const defaultBg = gender === 'female'
    ? 'linear-gradient(180deg,#fce7f3,#ede9fe)'
    : 'linear-gradient(180deg,#dbeafe,#d1fae5)'

  return (
    <div style={{
      position:     'relative',
      width:        W,
      height:       H,
      borderRadius: isLg ? '20px' : '16px',
      overflow:     'hidden',
      border:       `3px solid ${bgTheme ? bgTheme.border : 'rgba(255,255,255,0.9)'}`,
      boxShadow:    bgTheme
        ? `0 6px 24px rgba(0,0,0,0.2), 0 0 0 2px ${bgTheme.border}44`
        : '0 6px 24px rgba(0,0,0,0.15)',
      margin:       '0 auto',
      flexShrink:   0,
      background:   bgTheme ? bgTheme.grad : defaultBg,
      transition:   'border 0.3s, box-shadow 0.3s',
    }}>

      {/* 배경 이미지 (배경 아이템 선택 시) */}
      {background && (
        <img
          src={`/items/${background.id}.jpg`}
          alt={background.name}
          style={{
            position:  'absolute', inset: 0,
            width:     '100%', height: '100%',
            objectFit: 'cover',
            opacity:   0.85,
          }}
        />
      )}

      {/* 동반자 (캐릭터 뒤 오른쪽) */}
      <ItemOverlay item={companion} scale={scale} />

      {/* AI 베이스 캐릭터 */}
      <img
        src={charSrc}
        alt="캐릭터"
        style={{
          position:     'absolute',
          top:          35 * scale,
          left:         0,
          width:        W,
          height:       200 * scale,
          objectFit:    'contain',
          mixBlendMode: 'multiply',
          zIndex:       5,
        }}
      />

      {/* 모자 */}
      <ItemOverlay item={hat} scale={scale} />

      {/* 액세서리 */}
      <ItemOverlay item={accessory} scale={scale} />

      {/* 레벨 뱃지 */}
      {playerData && (
        <div style={{
          position:  'absolute', top: 6, right: 6, zIndex: 20,
          background:'rgba(255,255,255,0.95)', borderRadius:'99px',
          padding:   '2px 8px', fontSize:'11px', fontWeight:'bold', color:'#1d4ed8',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        }}>
          Lv.{playerData.level}
        </div>
      )}
    </div>
  )
}
