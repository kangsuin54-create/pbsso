import { useState } from 'react'
import { LUMOS_STAGES } from '../data/lumosStages'
import BottomNav from '../components/BottomNav'
import useIsMobile from '../hooks/useIsMobile'

export default function StageSelectScreen({ playerData, onEnterStage, onBack }) {
  const isMobile = useIsMobile()
  const [hoveredId, setHoveredId] = useState(null)
  const pad = isMobile ? 12 : 24

  const isCleared = (id) => playerData?.clearedStages?.includes(id)
  const isLocked = (stage) => (playerData?.level || 1) < stage.minLevel
  const crystalPower = playerData?.crystalPower || 0
  const allCleared = playerData?.clearedStages?.length === 8

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f0c29 0%, #1a1035 60%, #0d1b2a 100%)', paddingBottom: '80px' }}>
      {/* 상단 헤더 */}
      <div style={{ padding: `${pad}px ${pad}px 0`, paddingTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            color: 'white', borderRadius: '50%', width: '36px', height: '36px',
            fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>←</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px' }}>L.U.M.O.S</div>
            <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>빛의 퀘스트</div>
          </div>
          <div style={{ width: '36px' }} />
        </div>

        {/* 루모스 크리스탈 게이지 */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', borderRadius: '16px',
          padding: '16px', border: '1px solid rgba(251,191,36,0.2)', marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>💎</span>
              <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '14px' }}>루모스 크리스탈</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
              {playerData?.clearedStages?.length || 0} / 8 정화
            </span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '8px',
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
              width: `${crystalPower}%`,
              transition: 'width 0.8s ease',
              boxShadow: '0 0 10px rgba(251,191,36,0.5)',
            }} />
          </div>
          {allCleared && (
            <div style={{ textAlign: 'center', marginTop: '8px', color: '#fbbf24', fontSize: '13px', fontWeight: 'bold' }}>
              ✨ 루모스 크리스탈 완성! ✨
            </div>
          )}
        </div>

        <h2 style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>
          교실을 선택하여 몬스터를 정화하세요
        </h2>
      </div>

      {/* 교실 그리드 */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '12px', padding: `0 ${pad}px`,
      }}>
        {LUMOS_STAGES.map((stage) => {
          const cleared = isCleared(stage.id)
          const locked = isLocked(stage)
          const hovered = hoveredId === stage.id

          return (
            <button
              key={stage.id}
              onClick={() => !locked && onEnterStage(stage.id)}
              onMouseEnter={() => setHoveredId(stage.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                position: 'relative', outline: 'none', cursor: locked ? 'not-allowed' : 'pointer',
                borderRadius: '16px', padding: '16px', textAlign: 'center',
                transition: 'all 0.2s ease',
                transform: hovered && !locked ? 'scale(1.03)' : 'scale(1)',
                background: cleared
                  ? `linear-gradient(135deg, ${stage.monster.color}40, ${stage.monster.color}20)`
                  : locked
                    ? 'rgba(255,255,255,0.03)'
                    : `linear-gradient(135deg, ${stage.monster.darkColor}80, rgba(0,0,0,0.4))`,
                border: cleared
                  ? `1px solid ${stage.monster.color}60`
                  : locked
                    ? '1px solid rgba(255,255,255,0.05)'
                    : `1px solid ${stage.monster.color}30`,
                boxShadow: cleared ? `0 0 20px ${stage.monster.color}20` : 'none',
                opacity: locked ? 0.5 : 1,
              }}
            >
              {/* 잠금 표시 */}
              {locked && (
                <div style={{
                  position: 'absolute', top: '8px', right: '8px',
                  background: 'rgba(0,0,0,0.6)', borderRadius: '50%',
                  width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px',
                }}>🔒</div>
              )}

              {/* 클리어 표시 */}
              {cleared && (
                <div style={{
                  position: 'absolute', top: '8px', right: '8px',
                  background: '#22c55e', borderRadius: '50%',
                  width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', boxShadow: '0 0 8px rgba(34,197,94,0.5)',
                }}>✓</div>
              )}

              {/* 몬스터 이모지 */}
              <div style={{
                fontSize: '36px', marginBottom: '8px',
                filter: cleared ? 'none' : locked ? 'grayscale(80%)' : `drop-shadow(0 0 8px ${stage.monster.color})`,
                animation: !cleared && !locked ? 'pulse 2s ease-in-out infinite' : 'none',
              }}>
                {cleared ? stage.purificationItem.emoji : stage.monster.emoji}
              </div>

              {/* 스테이지 번호 */}
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginBottom: '2px' }}>
                STAGE {stage.id}
              </div>

              {/* 교실명 */}
              <div style={{
                color: cleared ? stage.monster.color : locked ? 'rgba(255,255,255,0.3)' : 'white',
                fontWeight: 'bold', fontSize: '12px', lineHeight: '1.3', marginBottom: '4px',
              }}>
                {cleared ? stage.clearedName : stage.classroom}
              </div>

              {/* 몬스터명 또는 테마 */}
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>
                {cleared ? `✨ ${stage.theme}` : locked ? `Lv.${stage.minLevel} 필요` : stage.monster.name}
              </div>
            </button>
          )
        })}
      </div>

      {/* 전체 클리어 버튼 */}
      {allCleared && (
        <div style={{ padding: `16px ${pad}px`, marginTop: '8px' }}>
          <button
            onClick={() => onEnterStage('final')}
            style={{
              width: '100%', padding: '16px', border: 'none', borderRadius: '16px',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: '#1a1400', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
              boxShadow: '0 0 30px rgba(251,191,36,0.4)',
            }}
          >
            💎 루모스 크리스탈 완성 보기!
          </button>
        </div>
      )}

      <BottomNav current="home" onNavigate={() => {}} />

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}
