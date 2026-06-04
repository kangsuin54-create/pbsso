import { useState } from 'react'
import { SHOP_ITEMS } from '../data/shopItems'
import CharacterSVG from '../components/CharacterSVG'
import BottomNav from '../components/BottomNav'
import useIsMobile from '../hooks/useIsMobile'

const GOALS = [
  { key: 'selfControl', label: '자기조절', emoji: '🧘', color: '#a78bfa' },
  { key: 'social', label: '사회성', emoji: '👫', color: '#34d399' },
  { key: 'ruleUnderstanding', label: '규칙 이해', emoji: '📖', color: '#60a5fa' },
  { key: 'positiveRelationship', label: '긍정적 관계', emoji: '💛', color: '#fbbf24' },
]

const CATEGORY_LABELS = { hat: '🎩 모자', accessory: '💎 액세서리', companion: '🐱 동반자', background: '🌈 배경' }

export default function MyPageScreen({ playerData, user, actions, onLogout }) {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('profile') // profile | inventory

  const owned = playerData.ownedItems || []
  const equipped = playerData.equippedItems || {}

  const ownedItemObjects = SHOP_ITEMS.filter(i => owned.includes(i.id))
  const groupedInventory = ownedItemObjects.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const totalProgress = Object.values(playerData.progress || {}).reduce((a, b) => a + b, 0) / 4
  const grade = totalProgress >= 80 ? '🥇 금' : totalProgress >= 60 ? '🥈 은' : totalProgress >= 40 ? '🥉 동' : '📜 참가'

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px', background: 'linear-gradient(180deg, #eff6ff, #f0fdf4)' }}>
      {/* 헤더 */}
      <div style={{
        background: 'white', borderBottom: '3px solid #bfdbfe',
        padding: isMobile ? '12px' : '16px 20px',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 'bold', color: '#1d4ed8' }}>
            👤 마이페이지
          </h2>
          <button onClick={onLogout} style={{
            background: '#fee2e2', border: '2px solid #fca5a5', borderRadius: '99px',
            padding: '6px 14px', fontSize: '13px', color: '#991b1b', cursor: 'pointer', fontWeight: 'bold',
          }}>로그아웃</button>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: isMobile ? '12px' : '16px' }}>
        {/* 캐릭터 카드 */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '20px',
          marginBottom: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          border: '2px solid #bfdbfe',
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ flex: '0 0 130px' }}>
              <CharacterSVG equipped={equipped} gender={playerData.gender || 'male'} size="md" playerData={playerData} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: isMobile ? '17px' : '20px', color: '#1f2937', marginBottom: '4px' }}>
                {playerData.name}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px' }}>
                {user?.email}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[
                  { label: `Lv.${playerData.level}`, color: '#dbeafe', text: '#1d4ed8' },
                  { label: `⭐ ${playerData.exp} EXP`, color: '#fef3c7', text: '#92400e' },
                  { label: `🪙 ${playerData.coins || 0}`, color: '#fef3c7', text: '#92400e' },
                  { label: `🤝 ${playerData.teamPoints}`, color: '#d1fae5', text: '#065f46' },
                  { label: grade, color: '#ede9fe', text: '#4c1d95' },
                ].map(b => (
                  <span key={b.label} style={{
                    background: b.color, color: b.text, borderRadius: '99px',
                    padding: '3px 10px', fontSize: '12px', fontWeight: 'bold',
                  }}>{b.label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 성별 변경 */}
          <div style={{ marginTop: '12px', borderTop: '2px solid #f3f4f6', paddingTop: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '6px' }}>캐릭터 변경</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { value: 'male', label: '🧙‍♂️ 남자', color: '#dbeafe', border: '#60a5fa' },
                { value: 'female', label: '🧙‍♀️ 여자', color: '#fce7f3', border: '#f9a8d4' },
              ].map(opt => (
                <button key={opt.value} onClick={() => actions.setGender(opt.value)} style={{
                  flex: 1, padding: '8px', border: `2px solid ${(playerData.gender || 'male') === opt.value ? opt.border : '#e5e7eb'}`,
                  borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold',
                  background: (playerData.gender || 'male') === opt.value ? opt.color : 'white',
                  transition: 'all 0.2s',
                }}>{opt.label}</button>
              ))}
            </div>
          </div>

          {/* 장착 아이템 요약 */}
          <div style={{ marginTop: '14px', borderTop: '2px solid #f3f4f6', paddingTop: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', marginBottom: '8px' }}>현재 장착</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
                <div key={cat} style={{
                  background: equipped[cat] ? '#ede9fe' : '#f9fafb',
                  border: `1px solid ${equipped[cat] ? '#c4b5fd' : '#e5e7eb'}`,
                  borderRadius: '10px', padding: '6px 10px',
                  fontSize: '12px', color: equipped[cat] ? '#4c1d95' : '#9ca3af',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <span>{equipped[cat]?.emoji || '—'}</span>
                  <span>{equipped[cat]?.name || label.split(' ')[1] + ' 없음'}</span>
                  {equipped[cat] && (
                    <button onClick={() => actions.unequip(cat)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#9ca3af', fontSize: '12px', padding: '0 0 0 2px', lineHeight: 1,
                    }}>✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '12px', padding: '4px', marginBottom: '14px' }}>
          {[['profile', '📊 성장 기록'], ['inventory', '🎒 인벤토리']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '10px', cursor: 'pointer',
              fontWeight: 'bold', fontSize: '13px', transition: 'all 0.2s',
              background: activeTab === tab ? 'white' : 'transparent',
              color: activeTab === tab ? '#1d4ed8' : '#9ca3af',
              boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            }}>{label}</button>
          ))}
        </div>

        {/* 성장 기록 탭 */}
        {activeTab === 'profile' && (
          <div>
            {/* 성장 목표 */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>🎯 성장 목표</div>
              {GOALS.map(goal => (
                <div key={goal.key} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span>{goal.emoji} {goal.label}</span>
                    <span style={{ color: goal.color, fontWeight: 'bold' }}>{playerData.progress?.[goal.key] || 0}%</span>
                  </div>
                  <div style={{ background: '#f3f4f6', borderRadius: '99px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ background: goal.color, width: `${playerData.progress?.[goal.key] || 0}%`, height: '100%', borderRadius: '99px', transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* 배지 */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>🏅 획득한 배지 ({playerData.badges?.length || 0}개)</div>
              {playerData.badges?.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {playerData.badges.map((badge, i) => (
                    <span key={i} style={{
                      background: '#fdf4ff', border: '2px solid #e9d5ff', borderRadius: '99px',
                      padding: '5px 12px', fontSize: '12px', fontWeight: 'bold', color: '#7e22ce',
                    }}>{badge}</span>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', padding: '16px' }}>
                  아직 배지가 없어요. 퀘스트를 완료해서 배지를 모아봐요! 🏅
                </div>
              )}
            </div>
          </div>
        )}

        {/* 인벤토리 탭 */}
        {activeTab === 'inventory' && (
          <div>
            {ownedItemObjects.length === 0 ? (
              <div style={{
                background: 'white', borderRadius: '16px', padding: '40px 20px',
                textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎒</div>
                <div style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '6px' }}>아직 아이템이 없어요!</div>
                <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px' }}>퀘스트를 완료해서 코인을 모으고 상점에서 아이템을 구매해봐요!</div>
                <button onClick={() => actions.goTo('shop')} style={{
                  background: 'linear-gradient(135deg, #7c3aed, #db2777)', color: 'white',
                  border: 'none', borderRadius: '99px', padding: '10px 24px',
                  fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
                }}>🛍️ 상점 가기</button>
              </div>
            ) : (
              Object.entries(groupedInventory).map(([cat, items]) => (
                <div key={cat} style={{ background: 'white', borderRadius: '16px', padding: '14px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', fontSize: '14px' }}>
                    {CATEGORY_LABELS[cat]}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {items.map(item => {
                      const isEquipped = equipped[cat]?.id === item.id
                      return (
                        <button key={item.id} onClick={() => actions.toggleEquip(item)} style={{
                          background: isEquipped ? 'linear-gradient(135deg, #ede9fe, #fae8ff)' : '#f9fafb',
                          border: `2px solid ${isEquipped ? '#a78bfa' : '#e5e7eb'}`,
                          borderRadius: '12px', padding: '12px 8px', cursor: 'pointer',
                          textAlign: 'center', transition: 'all 0.2s',
                        }}>
                          <div style={{ fontSize: '28px', marginBottom: '4px' }}>{item.emoji}</div>
                          <div style={{ fontSize: '11px', fontWeight: 'bold', color: isEquipped ? '#7c3aed' : '#374151' }}>
                            {item.name}
                          </div>
                          {isEquipped && (
                            <div style={{ fontSize: '10px', color: '#a78bfa', marginTop: '2px' }}>✓ 장착됨</div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav current="mypage" onNavigate={actions.goTo} />
    </div>
  )
}
