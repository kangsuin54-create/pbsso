/* eslint-disable react-hooks/immutability */
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { INITIAL_EQUIPPED } from '../data/shopItems'

const DEBOUNCE_MS = 1500
const STARTER_ITEM_IDS = ['hat_baseball', 'acc_ribbon', 'pet_cat', 'bg_rainbow']

export const makeInitialPlayer = (user) => ({
  name: user?.user_metadata?.nickname || user?.email?.split('@')[0] || '용감한 모험가',
  gender: user?.user_metadata?.gender || 'male',
  exp: 0, level: 1, teamPoints: 0, coins: 50,
  badges: [], items: [],
  ownedItems: [...STARTER_ITEM_IDS],
  equippedItems: { ...INITIAL_EQUIPPED },
  progress: { selfControl: 0, social: 0, ruleUnderstanding: 0, positiveRelationship: 0 },
  sessionRewards: [],
  clearedStages: [],
  currentStageCards: [],
  lumosItems: [],
  crystalPower: 0,
})

export function usePlayerData(user) {
  const [playerData, setPlayerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [storySeen, setStorySeen] = useState(true)
  const [dailyMissions, setDailyMissions] = useState([])
  const [streakCount, setStreakCount] = useState(0)

  const saveTimer = useRef(null)
  const isFirstLoad = useRef(true)
  const userIdRef = useRef(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    userIdRef.current = user.id
    if (user.id === 'guest') {
      setPlayerData(makeInitialPlayer(user))
      setStorySeen(false)
      setLoading(false)
      return
    }
    loadFromDB(user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // 디바운스 저장
  useEffect(() => {
    if (!playerData || !user || user.id === 'guest' || loading) return
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      return
    }
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveToDB(playerData)
    }, DEBOUNCE_MS)
    return () => clearTimeout(saveTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerData])

  // 창 닫힐 때 즉시 저장
  useEffect(() => {
    const handleUnload = () => {
      if (playerData && user && user.id !== 'guest') {
        saveToDB(playerData)
      }
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerData, user])

  async function loadFromDB(user) {
    try {
      const { data, error } = await supabase
        .from('player_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        // 신규 유저
        const initial = makeInitialPlayer(user)
        await supabase.from('player_progress').insert({
          user_id: user.id,
          game_data: initial,
          is_new_user: false,
          story_seen: false,
          last_active_date: today(),
          streak_count: 1,
        })
        setPlayerData(initial)
        setStorySeen(false)
        setStreakCount(1)
        await setupDailyMissions(user.id, null)
      } else {
        // 기존 유저: game_data 마이그레이션 (신규 필드 없으면 추가)
        const gd = data.game_data || {}
        const merged = {
          ...makeInitialPlayer(user),
          ...gd,
          clearedStages: gd.clearedStages || [],
          currentStageCards: gd.currentStageCards || [],
          lumosItems: gd.lumosItems || [],
          crystalPower: gd.crystalPower || 0,
        }
        setPlayerData(merged)
        setStorySeen(data.story_seen ?? true)
        setStreakCount(data.streak_count || 0)
        await checkDailyReset(user.id, data)
      }
    } catch {
      // DB 오류 시 로컬 모드로 폴백
      setPlayerData(makeInitialPlayer(user))
      setStorySeen(false)
    } finally {
      setLoading(false)
    }
  }

  async function saveToDB(data) {
    if (!userIdRef.current || userIdRef.current === 'guest') return
    try {
      await supabase.from('player_progress')
        .update({ game_data: data })
        .eq('user_id', userIdRef.current)
    } catch { /* 저장 실패 시 무시 */ }
  }

  async function checkDailyReset(userId, row) {
    const todayStr = today()
    if (row.daily_missions_date === todayStr) {
      setDailyMissions(row.daily_missions || [])
      return
    }
    // 새 날: 스트릭 계산
    const yesterdayStr = yesterday()
    const newStreak = row.last_active_date === yesterdayStr
      ? (row.streak_count || 0) + 1
      : 1
    setStreakCount(newStreak)
    await setupDailyMissions(userId, newStreak)
    await supabase.from('player_progress').update({
      streak_count: newStreak,
      last_active_date: todayStr,
    }).eq('user_id', userId)
  }

  async function setupDailyMissions(userId, streak) {
    const { selectDailyMissions } = await import('../data/dailyMissions.js')
    const missions = selectDailyMissions(3)
    const todayStr = today()
    setDailyMissions(missions)
    if (userId && userId !== 'guest') {
      await supabase.from('player_progress').update({
        daily_missions: missions,
        daily_missions_date: todayStr,
      }).eq('user_id', userId)
    }
    // 스트릭 보상
    if (streak) applyStreakReward(streak)
  }

  function applyStreakReward(streak) {
    const STREAK_REWARDS = {
      3:  { coins: 30 },
      7:  { coins: 100, badge: '7일 연속 정화단 🔥' },
      14: { coins: 200, badge: '2주 영웅 ⚡' },
      30: { coins: 500, badge: '한달 루모스 마스터 👑' },
    }
    const reward = STREAK_REWARDS[streak]
    if (!reward) return
    setPlayerData(prev => {
      if (!prev) return prev
      const updated = { ...prev, coins: (prev.coins || 0) + reward.coins }
      if (reward.badge && !prev.badges.includes(reward.badge)) {
        updated.badges = [...prev.badges, reward.badge]
      }
      return updated
    })
  }

  const markStorySeen = async () => {
    setStorySeen(true)
    if (user?.id && user.id !== 'guest') {
      await supabase.from('player_progress')
        .update({ story_seen: true })
        .eq('user_id', user.id)
    }
  }

  const completeMission = async (missionId) => {
    const mission = dailyMissions.find(m => m.id === missionId)
    if (!mission || mission.completed) return

    const updated = dailyMissions.map(m =>
      m.id === missionId ? { ...m, completed: true } : m
    )
    setDailyMissions(updated)
    setPlayerData(prev => ({
      ...prev,
      exp: prev.exp + (mission.reward_exp || 0),
      coins: (prev.coins || 0) + (mission.reward_coins || 0),
    }))
    if (user?.id && user.id !== 'guest') {
      await supabase.from('player_progress')
        .update({ daily_missions: updated })
        .eq('user_id', user.id)
    }
  }

  return {
    playerData, setPlayerData, loading,
    storySeen, markStorySeen,
    dailyMissions, completeMission,
    streakCount,
  }
}

// ── 날짜 유틸 ──
function today() {
  return new Date().toISOString().split('T')[0]
}
function yesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}
