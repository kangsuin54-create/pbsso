import { useRef } from 'react'
import { LUMOS_STAGES } from '../data/lumosStages'
import BottomNav from '../components/BottomNav'
import useIsMobile from '../hooks/useIsMobile'
import MonsterImage from '../components/MonsterImage'

const DOOR_WIDTH = 150
const DOOR_GAP = 70

function Door({ stage, cleared, locked, onClick }) {
  return (
    <button
      onClick={locked ? () => alert(`레벨 ${stage.minLevel} 이상 필요해요!\n(현재 레벨을 높이려면 다른 스테이지를 먼저 클리어하세요)`) : onClick}
      style={{
        position: 'relative', width: DOOR_WIDTH, height: '210px', flexShrink: 0,
        border: 'none', cursor: locked ? 'not-allowed' : 'pointer', background: 'none', padding: 0,
        opacity: locked ? 0.55 : 1,
      }}
    >
      {/* 문 */}
      <div style={{
        width: '100%', height: '170px', borderRadius: '8px 8px 4px 4px',
        background: cleared
          ? `linear-gradient(180deg, ${stage.monster.color}, ${stage.monster.color}cc)`
          : locked
            ? 'linear-gradient(180deg, #3f3f46, #27272a)'
            : `linear-gradient(180deg, ${stage.monster.darkColor}, #1a1035)`,
        border: `3px solid ${cleared ? '#fde68a' : locked ? '#52525b' : stage.monster.color + '80'}`,
        boxShadow: cleared
          ? `0 0 24px ${stage.monster.color}aa`
          : locked ? 'none' : `0 0 16px ${stage.monster.color}50`,
        position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        animation: !cleared && !locked ? 'doorGlow 2.2s ease-in-out infinite' : 'none',
      }}>
        {/* 문 손잡이 */}
        <div style={{
          position: 'absolute', right: '10px', top: '50%', width: '8px', height: '8px',
          borderRadius: '50%', background: '#fde68a',
        }} />

        {/* 잠금/클리어 표시 */}
        <div style={{ position: 'absolute', top: '-10px', right: '-6px', fontSize: '18px' }}>
          {locked ? '🔒' : cleared ? '✨' : ''}
        </div>

        <MonsterImage
          src={cleared ? stage.purificationItem.image : stage.monster.image}
          emoji={cleared ? stage.purificationItem.emoji : stage.monster.emoji}
          size={44}
        />
      </div>

      {/* 표지판 */}
      <div style={{ marginTop: '8px', textAlign: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px' }}>STAGE {stage.id}</div>
        <div style={{
          color: cleared ? '#fde68a' : locked ? 'rgba(255,255,255,0.35)' : 'white',
          fontWeight: 'bold', fontSize: '11px', lineHeight: '1.3',
        }}>
          {cleared ? stage.clearedName : stage.classroom}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '9px' }}>
          {locked ? `Lv.${stage.minLevel} 필요` : cleared ? `✨ ${stage.theme}` : stage.npc}
        </div>
      </div>

      <style>{`
        @keyframes doorGlow {
          0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.25); }
        }
      `}</style>
    </button>
  )
}

export default function CorridorScreen({ playerData, actions, onEnterStage, onBack, onViewFinale }) {
  const isMobile = useIsMobile()
  const scrollRef = useRef(null)
  const pad = isMobile ? 12 : 24

  const isCleared = (id) => playerData?.clearedStages?.includes(id)
  const isLocked = (stage) => (playerData?.level || 1) < stage.minLevel
  const crystalPower = playerData?.crystalPower || 0
  const allCleared = playerData?.clearedStages?.length === 8

  const corridorWidth = LUMOS_STAGES.length * (DOOR_WIDTH + DOOR_GAP) + DOOR_GAP

  return (
    <div style={{ minHeight: '100vh', background: '#0a0818', paddingBottom: '80px', position: 'relative' }}>
      {/* 상단 헤더 (고정) */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30, padding: `16px ${pad}px 10px`,
        background: 'linear-gradient(180deg, #0a0818 80%, transparent)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            color: 'white', borderRadius: '50%', width: '36px', height: '36px',
            fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>←</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#fbbf24', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>L.U.M.O.S — 복도</div>
            <div style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>
              💎 {playerData?.clearedStages?.length || 0} / 8 정화 ({Math.round(crystalPower)}%)
            </div>
          </div>
          <div style={{ width: '36px' }} />
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '8px', background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
            width: `${crystalPower}%`, transition: 'width 0.8s ease',
          }} />
        </div>
      </div>

      {/* 복도 (가로 스크롤) */}
      <div
        ref={scrollRef}
        style={{
          overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch',
          padding: '20px 0 12px',
        }}
      >
        <div style={{
          width: `${corridorWidth}px`, minHeight: '260px',
          backgroundImage: 'linear-gradient(180deg, rgba(10,8,24,0.5), rgba(10,8,24,0.85)), url(/school/corridor.jpg)',
          backgroundRepeat: 'repeat-x', backgroundSize: 'auto 100%',
          display: 'flex', alignItems: 'center', gap: `${DOOR_GAP}px`,
          paddingLeft: `${DOOR_GAP}px`, paddingRight: `${DOOR_GAP}px`,
        }}>
          {LUMOS_STAGES.map(stage => (
            <Door
              key={stage.id}
              stage={stage}
              cleared={isCleared(stage.id)}
              locked={isLocked(stage)}
              onClick={() => onEnterStage(stage.id)}
            />
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '4px' }}>
        ← 옆으로 밀어서 복도를 둘러보세요 →
      </div>

      {/* 전체 클리어 */}
      {allCleared && (
        <div style={{ padding: `16px ${pad}px`, marginTop: '8px' }}>
          <button onClick={onViewFinale} style={{
            width: '100%', padding: '16px', border: 'none', borderRadius: '16px',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#1a1400', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
            boxShadow: '0 0 30px rgba(251,191,36,0.4)',
          }}>
            💎 루모스 크리스탈 완성 보기!
          </button>
        </div>
      )}

      <BottomNav current="stage_select" onNavigate={actions?.goTo} />
    </div>
  )
}
