import { useState, useEffect } from 'react'
import './index.css'
import { supabase } from './lib/supabase'
import { usePlayerData, makeInitialPlayer } from './hooks/usePlayerData'
import LevelUpPopup from './components/LevelUpPopup'
import AuthScreen from './screens/AuthScreen'
import HomeScreen from './screens/HomeScreen'
import StoryIntroScreen from './screens/StoryIntroScreen'
import StageSelectScreen from './screens/StageSelectScreen'
import LearningScreen from './screens/LearningScreen'
import SimulationScreen from './screens/SimulationScreen'
import DashboardScreen from './screens/DashboardScreen'
import ShopScreen from './screens/ShopScreen'
import MyPageScreen from './screens/MyPageScreen'

export default function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [screen, setScreen] = useState('home')
  const [currentStage, setCurrentStage] = useState(null) // 1~8
  const [levelUpEvent, setLevelUpEvent] = useState(null)

  const {
    playerData, setPlayerData, loading: dataLoading,
    storySeen, markStorySeen,
    dailyMissions, completeMission,
    streakCount,
  } = usePlayerData(user)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user)
      else { setUser(null); setScreen('home') }
    })
    return () => subscription.unsubscribe()
  }, [])

  // 첫 로그인 시 스토리 인트로 자동 진입
  useEffect(() => {
    if (!dataLoading && !storySeen && user && screen === 'home') {
      setScreen('story')
    }
  }, [storySeen, user, dataLoading, screen])

  const handleLogin = (u) => setUser(u)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setScreen('home')
  }

  // ── 게임 액션 ──
  const LEVEL_BONUS = { 2:20, 3:30, 4:40, 5:60, 6:80, 7:100, 8:120, 9:150, 10:200 }

  const addExp = (amount) => setPlayerData(prev => {
    const newExp = prev.exp + amount
    const newLevel = Math.floor(newExp / 100) + 1
    if (newLevel > prev.level) {
      setLevelUpEvent(newLevel)
      const bonus = LEVEL_BONUS[newLevel] || newLevel * 10
      return { ...prev, exp: newExp, level: newLevel, coins: (prev.coins || 0) + bonus }
    }
    return { ...prev, exp: newExp, level: newLevel }
  })

  const addCoins = (amount) => setPlayerData(prev => ({ ...prev, coins: (prev.coins || 0) + amount }))

  const addTeamPoints = (amount) => {
    setPlayerData(prev => ({
      ...prev,
      teamPoints: prev.teamPoints + amount,
      progress: { ...prev.progress, positiveRelationship: Math.min(100, (prev.progress.positiveRelationship || 0) + amount * 2) },
    }))
  }

  const addBadge = (badge) => setPlayerData(prev => {
    if (prev.badges.includes(badge)) return prev
    return { ...prev, badges: [...prev.badges, badge], sessionRewards: [...prev.sessionRewards, { type: 'badge', name: badge }] }
  })

  const addItem = (item) => setPlayerData(prev => ({
    ...prev, items: [...prev.items, item],
    sessionRewards: [...prev.sessionRewards, { type: 'item', name: item }],
  }))

  const updateProgress = (key, amount) => setPlayerData(prev => ({
    ...prev,
    progress: { ...prev.progress, [key]: Math.min(100, (prev.progress[key] || 0) + amount) },
  }))

  const addSessionReward = (reward) => setPlayerData(prev => ({
    ...prev, sessionRewards: [...prev.sessionRewards, reward],
  }))

  // 스테이지 클리어
  const clearStage = (stageId, purificationItem) => {
    setPlayerData(prev => {
      if (prev.clearedStages.includes(stageId)) return prev
      const newCleared = [...prev.clearedStages, stageId]
      const newCrystal = Math.min(100, (prev.crystalPower || 0) + 12.5)
      const newLumosItems = purificationItem
        ? [...(prev.lumosItems || []), purificationItem.id]
        : prev.lumosItems
      return {
        ...prev,
        clearedStages: newCleared,
        crystalPower: newCrystal,
        lumosItems: newLumosItems,
        ownedItems: purificationItem && !prev.ownedItems.includes(purificationItem.id)
          ? [...prev.ownedItems, purificationItem.id]
          : prev.ownedItems,
      }
    })
  }

  // 상점 액션
  const buyItem = (item) => {
    setPlayerData(prev => {
      if ((prev.coins || 0) < item.price) return prev
      return {
        ...prev,
        coins: prev.coins - item.price,
        ownedItems: [...(prev.ownedItems || []), item.id],
        equippedItems: { ...prev.equippedItems, [item.category]: item },
      }
    })
  }

  const toggleEquip = (item) => {
    setPlayerData(prev => {
      const current = prev.equippedItems[item.category]
      const next = current?.id === item.id ? null : item
      return { ...prev, equippedItems: { ...prev.equippedItems, [item.category]: next } }
    })
  }

  const unequip = (category) => {
    setPlayerData(prev => ({ ...prev, equippedItems: { ...prev.equippedItems, [category]: null } }))
  }

  const setGender = (gender) => setPlayerData(prev => ({ ...prev, gender }))

  const gameActions = {
    addExp, addCoins, addTeamPoints, addBadge, addItem,
    updateProgress, addSessionReward, clearStage,
    buyItem, toggleEquip, unequip, setGender,
    completeMission,
    goTo: setScreen,
  }

  if (authLoading || (user && dataLoading)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '64px' }}>💡</div>
        <div style={{ fontSize: '18px', color: '#e0d7ff', fontWeight: 'bold' }}>L.U.M.O.S 불러오는 중...</div>
      </div>
    )
  }

  if (!user) return <AuthScreen onLogin={handleLogin} />

  const screens = {
    home: <HomeScreen
      playerData={playerData} user={user} onLogout={handleLogout}
      onStart={() => setScreen('stage_select')}
      actions={gameActions}
      dailyMissions={dailyMissions}
      streakCount={streakCount}
    />,
    story: <StoryIntroScreen
      playerData={playerData}
      onComplete={() => { markStorySeen(); setScreen('stage_select') }}
    />,
    stage_select: <StageSelectScreen
      playerData={playerData}
      onEnterStage={(stageId) => { setCurrentStage(stageId); setScreen('learning') }}
      onBack={() => setScreen('home')}
    />,
    learning: <LearningScreen
      playerData={playerData}
      stageId={currentStage}
      actions={gameActions}
      onComplete={() => setScreen('simulation')}
    />,
    simulation: <SimulationScreen
      playerData={playerData}
      stageId={currentStage}
      actions={gameActions}
      onComplete={() => setScreen('stage_select')}
      onAllCleared={() => setScreen('dashboard')}
    />,
    dashboard: <DashboardScreen
      playerData={playerData}
      onRestart={() => { setPlayerData(makeInitialPlayer(user)); setScreen('home') }}
    />,
    shop: <ShopScreen playerData={playerData} actions={gameActions} />,
    mypage: <MyPageScreen playerData={playerData} user={user} actions={gameActions} onLogout={handleLogout} />,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0fdf4 0%, #eff6ff 100%)' }}>
      {screens[screen] || screens.home}
      {levelUpEvent && (
        <LevelUpPopup level={levelUpEvent} onClose={() => setLevelUpEvent(null)} />
      )}
    </div>
  )
}
