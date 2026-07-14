import { useState, useEffect } from 'react'
import './index.css'
import { INITIAL_EQUIPPED } from './data/shopItems'
import LevelUpPopup from './components/LevelUpPopup'
import HomeScreen from './screens/HomeScreen'
import StoryIntroScreen from './screens/StoryIntroScreen'
import SchoolExteriorScreen from './screens/SchoolExteriorScreen'
import CorridorScreen from './screens/CorridorScreen'
import NpcDialogueScreen from './screens/NpcDialogueScreen'
import SimulationScreen from './screens/SimulationScreen'
import SchoolBrightenScreen from './screens/SchoolBrightenScreen'
import OutroScreen from './screens/OutroScreen'
import DashboardScreen from './screens/DashboardScreen'
import ShopScreen from './screens/ShopScreen'
import MyPageScreen from './screens/MyPageScreen'

const STORAGE_KEY = 'lumos_player'
const STORY_KEY = 'lumos_story_seen'

function loadPlayer() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return null
}

function savePlayer(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

const LOCAL_USER = { id: 'local', email: 'player@lumos.app', user_metadata: { nickname: '루모스 정화단원' } }
const STARTER_ITEM_IDS = ['hat_baseball', 'acc_ribbon', 'pet_cat', 'bg_rainbow']

function makeInitialPlayer(user) {
  return {
    name: user?.user_metadata?.nickname || '용감한 모험가',
    gender: user?.user_metadata?.gender || 'male',
    exp: 0, level: 1, teamPoints: 0, coins: 50,
    badges: [], items: [],
    ownedItems: [...STARTER_ITEM_IDS],
    equippedItems: { ...INITIAL_EQUIPPED },
    progress: { selfControl: 0, social: 0, ruleUnderstanding: 0, positiveRelationship: 0 },
    sessionRewards: [],
    clearedStages: [],
    currentStageCards: [],
    collectedCards: [],
    lumosItems: [],
    crystalPower: 0,
  }
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [currentStage, setCurrentStage] = useState(null)
  const [levelUpEvent, setLevelUpEvent] = useState(null)
  const [storySeen, setStorySeen] = useState(() => localStorage.getItem(STORY_KEY) === 'true')
  const [playerData, setPlayerDataRaw] = useState(() => loadPlayer() || makeInitialPlayer(LOCAL_USER))

  // playerData 변경 시 localStorage 저장
  const setPlayerData = (updater) => {
    setPlayerDataRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      savePlayer(next)
      return next
    })
  }

  // 첫 방문 시 스토리 인트로
  useEffect(() => {
    if (!storySeen && screen === 'home') setScreen('story')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  const addTeamPoints = (amount) => setPlayerData(prev => ({
    ...prev,
    teamPoints: prev.teamPoints + amount,
    progress: { ...prev.progress, positiveRelationship: Math.min(100, (prev.progress.positiveRelationship || 0) + amount * 2) },
  }))

  const addBadge = (badge) => setPlayerData(prev => {
    if (prev.badges.includes(badge)) return prev
    return { ...prev, badges: [...prev.badges, badge], sessionRewards: [...prev.sessionRewards, { type: 'badge', name: badge }] }
  })

  const collectCard = (cardId) => setPlayerData(prev => {
    if (prev.collectedCards?.includes(cardId)) return prev
    return { ...prev, collectedCards: [...(prev.collectedCards || []), cardId] }
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

  const clearStage = (stageId, purificationItem) => {
    setPlayerData(prev => {
      if (prev.clearedStages.includes(stageId)) return prev
      return {
        ...prev,
        clearedStages: [...prev.clearedStages, stageId],
        crystalPower: Math.min(100, (prev.crystalPower || 0) + 12.5),
        lumosItems: purificationItem ? [...(prev.lumosItems || []), purificationItem.id] : prev.lumosItems,
        ownedItems: purificationItem && !prev.ownedItems.includes(purificationItem.id)
          ? [...prev.ownedItems, purificationItem.id]
          : prev.ownedItems,
      }
    })
  }

  const buyItem = (item) => setPlayerData(prev => {
    if ((prev.coins || 0) < item.price) return prev
    return {
      ...prev,
      coins: prev.coins - item.price,
      ownedItems: [...(prev.ownedItems || []), item.id],
      equippedItems: { ...prev.equippedItems, [item.category]: item },
    }
  })

  const toggleEquip = (item) => setPlayerData(prev => {
    const current = prev.equippedItems[item.category]
    return { ...prev, equippedItems: { ...prev.equippedItems, [item.category]: current?.id === item.id ? null : item } }
  })

  const unequip = (category) => setPlayerData(prev => ({
    ...prev, equippedItems: { ...prev.equippedItems, [category]: null }
  }))

  const setGender = (gender) => setPlayerData(prev => ({ ...prev, gender }))

  const resetGame = () => {
    const fresh = makeInitialPlayer(LOCAL_USER)
    savePlayer(fresh)
    setPlayerDataRaw(fresh)
    localStorage.removeItem(STORY_KEY)
    setStorySeen(false)
    setScreen('story')
  }

  const gameActions = {
    addExp, addCoins, addTeamPoints, addBadge, addItem, collectCard,
    updateProgress, addSessionReward, clearStage,
    buyItem, toggleEquip, unequip, setGender,
    completeMission: () => {},
    goTo: setScreen,
  }

  const screens = {
    home: <HomeScreen
      playerData={playerData}
      user={LOCAL_USER}
      onLogout={resetGame}
      onStart={() => setScreen('stage_select')}
      actions={gameActions}
      dailyMissions={[]}
      streakCount={0}
    />,
    story: <StoryIntroScreen
      playerData={playerData}
      onComplete={() => {
        localStorage.setItem(STORY_KEY, 'true')
        setStorySeen(true)
        setScreen('school_exterior')
      }}
    />,
    school_exterior: <SchoolExteriorScreen
      onEnter={() => setScreen('stage_select')}
    />,
    stage_select: <CorridorScreen
      playerData={playerData}
      actions={gameActions}
      onEnterStage={(stageId) => {
        if (stageId === 'final') { setScreen('finale'); return }
        setCurrentStage(stageId)
        setScreen('learning')
      }}
      onBack={() => setScreen('home')}
      onViewFinale={() => setScreen('finale')}
    />,
    learning: <NpcDialogueScreen
      stageId={currentStage}
      actions={gameActions}
      onComplete={() => setScreen('simulation')}
    />,
    simulation: <SimulationScreen
      playerData={playerData}
      stageId={currentStage}
      actions={gameActions}
      onComplete={() => setScreen('stage_select')}
      onAllCleared={() => setScreen('outro')}
    />,
    outro: <OutroScreen
      onComplete={() => setScreen('finale')}
    />,
    finale: <SchoolBrightenScreen
      onContinue={() => setScreen('dashboard')}
    />,
    dashboard: <DashboardScreen
      playerData={playerData}
      onRestart={resetGame}
    />,
    shop: <ShopScreen playerData={playerData} actions={gameActions} />,
    mypage: <MyPageScreen playerData={playerData} user={LOCAL_USER} actions={gameActions} onLogout={resetGame} />,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0818' }}>
      <div key={screen} className="screen-fade">
        {screens[screen] || screens.home}
      </div>
      {levelUpEvent && (
        <LevelUpPopup level={levelUpEvent} onClose={() => setLevelUpEvent(null)} />
      )}
    </div>
  )
}
