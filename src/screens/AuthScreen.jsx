import { useState } from 'react'
import { supabase } from '../lib/supabase'
import useIsMobile from '../hooks/useIsMobile'

export default function AuthScreen({ onLogin }) {
  const isMobile = useIsMobile()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState('male')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLogin = async () => {
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요!'); return }
    setLoading(true); setError('')
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError('이메일 또는 비밀번호가 틀렸어요 😢'); return }
    onLogin(data.user)
  }

  const handleSignup = async () => {
    if (!email || !password || !nickname) { setError('모든 항목을 입력해주세요!'); return }
    if (password.length < 6) { setError('비밀번호는 6자리 이상이어야 해요!'); return }
    setLoading(true); setError('')
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname, gender },
        emailRedirectTo: 'https://pbs-social-trainer.vercel.app',
      },
    })
    setLoading(false)
    if (err) { setError('회원가입에 실패했어요: ' + err.message); return }
    if (data.user && !data.session) {
      setSuccess('이메일을 확인해서 인증을 완료해주세요! 📧')
    } else {
      onLogin(data.user)
    }
  }

  const handleGuest = () => {
    onLogin({ id: 'guest', email: 'guest@pbs.app', user_metadata: { nickname: '손님 모험가' } })
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #ecfdf5 0%, #eff6ff 50%, #fdf4ff 100%)',
      padding: isMobile ? '12px' : '20px',
    }}>
      <div style={{
        background: 'white', borderRadius: '24px',
        padding: isMobile ? '24px 18px' : '36px 28px',
        maxWidth: '380px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        border: '3px solid #bbf7d0',
      }}>
        {/* 마스코트 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '8px' }}>🧙‍♂️</div>
          <h1 style={{
            fontSize: '22px', fontWeight: '900', marginBottom: '4px',
            background: 'linear-gradient(135deg, #059669, #1d4ed8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>사회성 모험 퀘스트!</h1>
          <p style={{ fontSize: '13px', color: '#9ca3af' }}>PBS 기반 아동 사회성 훈련 프로그램</p>
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex', marginBottom: '24px', background: '#f3f4f6', borderRadius: '12px', padding: '4px' }}>
          {[['login', '🔑 로그인'], ['signup', '✨ 회원가입']].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }} style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '10px', cursor: 'pointer',
              fontWeight: 'bold', fontSize: '14px', transition: 'all 0.2s',
              background: mode === m ? 'white' : 'transparent',
              color: mode === m ? '#1d4ed8' : '#9ca3af',
              boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            }}>{label}</button>
          ))}
        </div>

        {/* 폼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mode === 'signup' && (
            <>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  🌟 닉네임
                </label>
                <input
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="모험가 이름을 입력하세요"
                  style={{
                    width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb',
                    borderRadius: '12px', fontSize: '15px', outline: 'none',
                    fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6ee7b7'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '8px' }}>
                  🧙 내 캐릭터 선택
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { value: 'male', label: '남자', emoji: '🧙‍♂️', desc: '파란 로브 마법사', color: '#dbeafe', border: '#60a5fa' },
                    { value: 'female', label: '여자', emoji: '🧙‍♀️', desc: '핑크 로브 마법사', color: '#fce7f3', border: '#f9a8d4' },
                  ].map(opt => (
                    <button key={opt.value} type="button" onClick={() => setGender(opt.value)} style={{
                      flex: 1, padding: '14px 8px', border: `3px solid ${gender === opt.value ? opt.border : '#e5e7eb'}`,
                      borderRadius: '14px', cursor: 'pointer', textAlign: 'center',
                      background: gender === opt.value ? opt.color : 'white',
                      transition: 'all 0.2s',
                    }}>
                      <div style={{ fontSize: '36px', marginBottom: '4px' }}>{opt.emoji}</div>
                      <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#1f2937' }}>{opt.label}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>
              📧 이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              style={{
                width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb',
                borderRadius: '12px', fontSize: '15px', outline: 'none',
                fontFamily: 'inherit', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#6ee7b7'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '6px' }}>
              🔒 비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? '6자리 이상 입력하세요' : '비밀번호를 입력하세요'}
              onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleSignup())}
              style={{
                width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb',
                borderRadius: '12px', fontSize: '15px', outline: 'none',
                fontFamily: 'inherit', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#6ee7b7'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2', border: '2px solid #fca5a5', borderRadius: '10px',
              padding: '10px 14px', fontSize: '13px', color: '#991b1b', textAlign: 'center',
            }}>{error}</div>
          )}

          {success && (
            <div style={{
              background: '#dcfce7', border: '2px solid #4ade80', borderRadius: '10px',
              padding: '10px 14px', fontSize: '13px', color: '#166534', textAlign: 'center',
            }}>{success}</div>
          )}

          <button
            onClick={mode === 'login' ? handleLogin : handleSignup}
            disabled={loading}
            style={{
              background: loading ? '#e5e7eb' : 'linear-gradient(135deg, #059669, #0284c7)',
              color: loading ? '#9ca3af' : 'white', border: 'none',
              borderRadius: '12px', padding: '14px', fontSize: '17px', fontWeight: 'bold',
              cursor: loading ? 'default' : 'pointer',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(5,150,105,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? '잠깐만요... ⏳' : mode === 'login' ? '🚀 모험 시작!' : '✨ 가입하고 시작!'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#d1d5db', marginBottom: '8px' }}>── 또는 ──</div>
            <button
              onClick={handleGuest}
              style={{
                background: '#f3f4f6', color: '#6b7280', border: '2px solid #e5e7eb',
                borderRadius: '12px', padding: '12px 20px', fontSize: '14px',
                fontWeight: 'bold', cursor: 'pointer', width: '100%',
              }}
            >
              👤 로그인 없이 체험하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}