import { useState } from 'react'
import { SHOP_ITEMS, CATEGORIES } from '../data/shopItems'
import { LUMOS_STAGES } from '../data/lumosStages'
import CharacterSVG from '../components/CharacterSVG'
import BottomNav from '../components/BottomNav'
import useIsMobile from '../hooks/useIsMobile'

function CardCollection({ collectedCards }) {
  const totalCards = LUMOS_STAGES.reduce((sum, s) => sum + s.skillCards.length, 0)
  const collectedCount = collectedCards.length

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #ede9fe, #fae8ff)', border: '2px solid #c4b5fd',
        borderRadius: '14px', padding: '12px 16px', marginBottom: '14px', textAlign: 'center',
      }}>
        <span style={{ fontWeight: 'bold', color: '#7c3aed', fontSize: '14px' }}>
          📖 수집한 카드 {collectedCount} / {totalCards}
        </span>
      </div>
      {LUMOS_STAGES.map(stage => (
        <div key={stage.id} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>{stage.monster.emoji}</span>
            <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#4b5563' }}>{stage.classroom}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {stage.skillCards.map(card => {
              const collected = collectedCards.includes(card.id)
              return (
                <div key={card.id} style={{
                  background: collected ? 'white' : '#f3f4f6',
                  border: `1.5px solid ${collected ? '#a78bfa' : '#e5e7eb'}`,
                  borderRadius: '12px', padding: '8px 4px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '22px', filter: collected ? 'none' : 'grayscale(100%) opacity(0.4)' }}>
                    {collected ? card.emoji : '❓'}
                  </div>
                  <div style={{
                    fontSize: '9px', marginTop: '2px', lineHeight: '1.2',
                    color: collected ? '#6d28d9' : '#9ca3af', fontWeight: collected ? 'bold' : 'normal',
                  }}>
                    {collected ? card.name : '???'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ShopScreen({ playerData, actions }) {
  const isMobile = useIsMobile()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [buyResult, setBuyResult] = useState(null) // { success, item }
  const [previewItem, setPreviewItem] = useState(null)

  const filtered = selectedCategory === 'all'
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter(i => i.category === selectedCategory)

  const owned = playerData.ownedItems || []
  const equipped = playerData.equippedItems || {}

  const previewEquipped = previewItem
    ? { ...equipped, [previewItem.category]: previewItem }
    : equipped

  const handleBuy = (item) => {
    setPreviewItem(item) // 항상 미리보기 업데이트
    if (owned.includes(item.id)) {
      actions.toggleEquip(item)
      return
    }
    if ((playerData.coins || 0) < item.price) {
      setBuyResult({ success: false, item })
      setTimeout(() => setBuyResult(null), 2500)
      return
    }
    actions.buyItem(item)
    setBuyResult({ success: true, item })
    setTimeout(() => setBuyResult(null), 2500)
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px', background: 'linear-gradient(180deg, #fdf4ff, #eff6ff)' }}>
      {/* 헤더 */}
      <div style={{
        background: 'white', borderBottom: '3px solid #e9d5ff',
        padding: isMobile ? '12px' : '16px 20px',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 'bold', color: '#7c3aed' }}>
            🛍️ 캐릭터 상점
          </h2>
          <div style={{
            background: '#fef3c7', border: '2px solid #fcd34d', borderRadius: '99px',
            padding: '6px 14px', fontWeight: 'bold', fontSize: '15px', color: '#92400e',
          }}>
            🪙 {playerData.coins || 0}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: isMobile ? '12px' : '16px' }}>
        {/* 캐릭터 미리보기 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '8px' }}>
            ✨ 내 캐릭터 미리보기
          </div>
          <CharacterSVG equipped={previewEquipped} gender={playerData.gender || 'male'} size="lg" playerData={playerData} />
          {previewItem && (
            <div style={{
              textAlign: 'center', marginTop: '8px', fontSize: '13px',
              color: '#7c3aed', fontWeight: 'bold',
            }}>
              👆 {previewItem.name} 미리보기 중... 클릭해서 구매/장착!
            </div>
          )}
        </div>

        {/* 알림 */}
        {buyResult && (
          <div style={{
            background: buyResult.success ? '#dcfce7' : '#fee2e2',
            border: `2px solid ${buyResult.success ? '#4ade80' : '#fca5a5'}`,
            borderRadius: '12px', padding: '10px 16px', marginBottom: '12px',
            textAlign: 'center', fontWeight: 'bold',
            fontSize: '14px', color: buyResult.success ? '#166534' : '#991b1b',
            animation: 'bounce-in 0.3s ease-out',
          }}>
            {buyResult.success
              ? `🎉 ${buyResult.item.name} 구매 완료!`
              : `💸 코인이 부족해요! (${buyResult.item.price} 코인 필요)`}
          </div>
        )}

        {/* 카테고리 탭 */}
        <div style={{
          display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto',
          paddingBottom: '4px', scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{
              background: selectedCategory === cat.id ? 'linear-gradient(135deg, #7c3aed, #db2777)' : 'white',
              color: selectedCategory === cat.id ? 'white' : '#6b7280',
              border: `2px solid ${selectedCategory === cat.id ? 'transparent' : '#e5e7eb'}`,
              borderRadius: '99px', padding: '7px 14px', fontSize: '13px',
              fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap',
              flexShrink: 0, transition: 'all 0.2s',
              boxShadow: selectedCategory === cat.id ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
            }}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* 카드 도감 또는 아이템 그리드 */}
        {selectedCategory === 'cards' ? (
          <CardCollection collectedCards={playerData.collectedCards || []} />
        ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {filtered.map(item => {
            const isOwned = owned.includes(item.id)
            const isEquipped = equipped[item.category]?.id === item.id
            const canAfford = (playerData.coins || 0) >= item.price

            return (
              <div key={item.id}
                style={{
                  background: isEquipped ? 'linear-gradient(135deg, #ede9fe, #fae8ff)' : 'white',
                  border: `2px solid ${isEquipped ? '#a78bfa' : isOwned ? '#6ee7b7' : '#e5e7eb'}`,
                  borderRadius: '16px', padding: '14px', textAlign: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: isEquipped ? '0 4px 16px rgba(124,58,237,0.2)' : '0 2px 8px rgba(0,0,0,0.06)',
                }}
                onClick={() => handleBuy(item)}
              >
                <div style={{ fontSize: '40px', marginBottom: '6px', lineHeight: 1 }}>{item.emoji}</div>
                <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#1f2937', marginBottom: '3px' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>{item.description}</div>

                {isEquipped ? (
                  <div style={{
                    background: '#a78bfa', color: 'white', borderRadius: '99px',
                    padding: '4px 12px', fontSize: '12px', fontWeight: 'bold',
                  }}>✓ 장착 중</div>
                ) : isOwned ? (
                  <div style={{
                    background: '#d1fae5', color: '#065f46', borderRadius: '99px',
                    padding: '4px 12px', fontSize: '12px', fontWeight: 'bold',
                    border: '1px solid #6ee7b7',
                  }}>보유 중 (탭: 장착)</div>
                ) : (
                  <div style={{
                    background: canAfford ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : '#f3f4f6',
                    color: canAfford ? 'white' : '#9ca3af',
                    borderRadius: '99px', padding: '4px 12px',
                    fontSize: '12px', fontWeight: 'bold',
                  }}>
                    🪙 {item.price} 코인
                  </div>
                )}
              </div>
            )
          })}
        </div>
        )}
      </div>

      <BottomNav current="shop" onNavigate={actions.goTo} />
    </div>
  )
}
