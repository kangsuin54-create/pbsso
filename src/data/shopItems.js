export const SHOP_ITEMS = [
  // 모자
  { id: 'hat_baseball', category: 'hat', name: '야구 모자', emoji: '🧢', price: 20, description: '시원하고 활발한 느낌!' },
  { id: 'hat_tophat', category: 'hat', name: '신사 모자', emoji: '🎩', price: 30, description: '클래식하고 우아해요!' },
  { id: 'hat_grad', category: 'hat', name: '박사 모자', emoji: '🎓', price: 40, description: '똑똑한 모험가!' },
  { id: 'hat_crown', category: 'hat', name: '왕관', emoji: '👑', price: 60, description: '왕처럼 빛나요!' },
  { id: 'hat_wizard', category: 'hat', name: '마법사 모자', emoji: '🪄', price: 50, description: '마법의 힘이 깃들어요!' },
  { id: 'hat_santa', category: 'hat', name: '산타 모자', emoji: '🎅', price: 35, description: '선물을 나눠요!' },

  // 액세서리
  { id: 'acc_glasses', category: 'accessory', name: '안경', emoji: '👓', price: 20, description: '지적인 분위기!' },
  { id: 'acc_sunglasses', category: 'accessory', name: '선글라스', emoji: '🕶️', price: 25, description: '쿨한 모험가!' },
  { id: 'acc_ribbon', category: 'accessory', name: '리본', emoji: '🎀', price: 15, description: '귀엽고 깜찍해요!' },
  { id: 'acc_necklace', category: 'accessory', name: '보석 목걸이', emoji: '💎', price: 50, description: '찬란하게 빛나요!' },
  { id: 'acc_bow', category: 'accessory', name: '나비 넥타이', emoji: '🦋', price: 30, description: '멋쟁이 모험가!' },
  { id: 'acc_medal', category: 'accessory', name: '금메달', emoji: '🥇', price: 45, description: '챔피언의 증표!' },

  // 동반자
  { id: 'pet_cat', category: 'companion', name: '고양이', emoji: '🐱', price: 40, description: '귀여운 고양이 친구!' },
  { id: 'pet_dog', category: 'companion', name: '강아지', emoji: '🐶', price: 40, description: '충직한 강아지 친구!' },
  { id: 'pet_dragon', category: 'companion', name: '아기 드래곤', emoji: '🐲', price: 80, description: '전설의 드래곤!' },
  { id: 'pet_unicorn', category: 'companion', name: '유니콘', emoji: '🦄', price: 90, description: '신비로운 유니콘!' },
  { id: 'pet_star', category: 'companion', name: '별 요정', emoji: '⭐', price: 60, description: '반짝이는 별 친구!' },
  { id: 'pet_robot', category: 'companion', name: '꼬마 로봇', emoji: '🤖', price: 70, description: '든든한 로봇 친구!' },

  // 배경
  { id: 'bg_rainbow', category: 'background', name: '무지개', emoji: '🌈', price: 40, bg: 'linear-gradient(135deg, #ffecd2, #fcb69f)', description: '알록달록 무지개!' },
  { id: 'bg_star', category: 'background', name: '별빛 밤하늘', emoji: '🌌', price: 50, bg: 'linear-gradient(135deg, #a8edea, #fed6e3)', description: '반짝이는 밤하늘!' },
  { id: 'bg_flower', category: 'background', name: '벚꽃', emoji: '🌸', price: 35, bg: 'linear-gradient(135deg, #ffeef8, #ffd6e7)', description: '아름다운 벚꽃!' },
  { id: 'bg_ocean', category: 'background', name: '파도 바다', emoji: '🌊', price: 45, bg: 'linear-gradient(135deg, #d0f0fd, #a8d8ea)', description: '시원한 바다!' },
  { id: 'bg_forest', category: 'background', name: '마법 숲', emoji: '🌲', price: 40, bg: 'linear-gradient(135deg, #d4edda, #c3e6cb)', description: '신비로운 숲속!' },
  { id: 'bg_fire', category: 'background', name: '불꽃', emoji: '🔥', price: 55, bg: 'linear-gradient(135deg, #ffecd2, #ffb347)', description: '뜨거운 에너지!' },

  // LUMOS 정화 아이템 (스테이지 클리어 시 자동 획득)
  { id: 'lm_smile_sticker', category: 'lumos', name: '웃음활짝 미소 스티커', emoji: '😊', price: 0, description: '아르케 정화 — 유연한 수용의 힘!' },
  { id: 'lm_together_shoes', category: 'lumos', name: '다함께 운동화', emoji: '👟', price: 0, description: '엔비어스 정화 — 공감의 힘!' },
  { id: 'lm_yield_flag', category: 'lumos', name: '차근차근 양보깃발', emoji: '🚩', price: 0, description: '아펠로 정화 — 행동 억제의 힘!' },
  { id: 'lm_bead_icecream', category: 'lumos', name: '동글동글 구슬 아이스크림', emoji: '🍦', price: 0, description: '이카리마 정화 — 감정 조절의 힘!' },
  { id: 'lm_sparkling_crown', category: 'lumos', name: '반짝반짝 왕관', emoji: '👑', price: 0, description: '미안타 정화 — 자기 효능감의 힘!' },
  { id: 'lm_courage_badge', category: 'lumos', name: '용기팡팡 마법뱃지', emoji: '🏅', price: 0, description: '부크리스 정화 — 사회적 개방의 힘!' },
  { id: 'lm_cozy_blanket', category: 'lumos', name: '포근포근 담요', emoji: '🛋️', price: 0, description: '쿠라야미 정화 — 심리적 안정의 힘!' },
  { id: 'lm_cotton_gloves', category: 'lumos', name: '보들보들 솜사탕 장갑', emoji: '🧤', price: 0, description: '내타시온 정화 — 자기 자비의 힘!' },
]

export const CATEGORIES = [
  { id: 'all', label: '전체', emoji: '🛍️' },
  { id: 'hat', label: '모자', emoji: '🎩' },
  { id: 'accessory', label: '액세서리', emoji: '💎' },
  { id: 'companion', label: '동반자', emoji: '🐱' },
  { id: 'background', label: '배경', emoji: '🌈' },
  { id: 'lumos', label: '루모스', emoji: '💎' },
  { id: 'cards', label: '카드 도감', emoji: '📖' },
]

export const INITIAL_EQUIPPED = {
  hat: null,
  accessory: null,
  companion: null,
  background: null,
}
