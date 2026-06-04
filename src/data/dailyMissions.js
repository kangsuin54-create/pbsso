export const MISSION_POOL = [
  { id: 'm_login',       title: '오늘 접속하기',          icon: '📅', reward_exp: 10,  reward_coins: 5,  category: 'attendance' },
  { id: 'm_skillcard',   title: '스킬카드 3장 배우기',     icon: '📚', reward_exp: 30,  reward_coins: 15, category: 'learning' },
  { id: 'm_battle',      title: '몬스터 1마리 정화하기',   icon: '⚔️', reward_exp: 50,  reward_coins: 25, category: 'battle' },
  { id: 'm_shop',        title: '상점 방문하기',           icon: '🛍️', reward_exp: 10,  reward_coins: 5,  category: 'shop' },
  { id: 'm_session',     title: '오늘의 모험 완료',        icon: '🏆', reward_exp: 60,  reward_coins: 30, category: 'session' },
  { id: 'm_equip',       title: '아이템 장착하기',         icon: '✨', reward_exp: 10,  reward_coins: 5,  category: 'shop' },
  { id: 'm_badge',       title: '배지 1개 획득하기',       icon: '🏅', reward_exp: 20,  reward_coins: 10, category: 'battle' },
  { id: 'm_quiz',        title: '퀴즈 5개 맞추기',        icon: '🎯', reward_exp: 40,  reward_coins: 20, category: 'learning' },
  { id: 'm_levelup',     title: '레벨업 달성하기',         icon: '⬆️', reward_exp: 0,   reward_coins: 50, category: 'growth' },
  { id: 'm_coins',       title: '코인 20개 모으기',        icon: '🪙', reward_exp: 15,  reward_coins: 0,  category: 'growth' },
]

// m_login은 항상 포함, 나머지 2개는 랜덤
export function selectDailyMissions(count = 3) {
  const mandatory = MISSION_POOL.find(m => m.id === 'm_login')
  const rest = MISSION_POOL.filter(m => m.id !== 'm_login')
  const shuffled = [...rest].sort(() => Math.random() - 0.5).slice(0, count - 1)
  return [mandatory, ...shuffled].map(m => ({ ...m, completed: false }))
}
