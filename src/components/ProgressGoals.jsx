import useIsMobile from '../hooks/useIsMobile'

const GOALS = [
  { key: 'selfControl', label: '자기조절', emoji: '🧘', color: '#a78bfa' },
  { key: 'social', label: '사회성', emoji: '👫', color: '#34d399' },
  { key: 'ruleUnderstanding', label: '규칙 이해', emoji: '📖', color: '#60a5fa' },
  { key: 'positiveRelationship', label: '긍정적 관계', emoji: '💛', color: '#fbbf24' },
]

export default function ProgressGoals({ progress }) {
  const isMobile = useIsMobile()

  return (
    <div style={{ background: '#fffbeb', borderTop: '3px solid #fcd34d', padding: isMobile ? '10px 12px' : '12px 20px' }}>
      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400e', marginBottom: '6px' }}>
        🎯 오늘의 성장 목표
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '6px' : '8px' }}>
        {GOALS.map(goal => (
          <div key={goal.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '3px' }}>
              <span>{goal.emoji} {goal.label}</span>
              <span style={{ color: goal.color, fontWeight: 'bold' }}>{progress[goal.key]}%</span>
            </div>
            <div style={{ background: '#e5e7eb', borderRadius: '99px', height: '7px', overflow: 'hidden' }}>
              <div style={{
                background: goal.color, width: `${progress[goal.key]}%`,
                height: '100%', borderRadius: '99px', transition: 'width 0.8s ease',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}