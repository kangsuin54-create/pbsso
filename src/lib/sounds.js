let audioCtx = null
let muted = false

function getCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    } catch {
      return null
    }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playTone({ freq, duration, type = 'sine', gain = 0.25 }) {
  if (muted) return
  try {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.connect(gainNode)
    gainNode.connect(ctx.destination)
    osc.type = type
    osc.frequency.value = freq
    gainNode.gain.setValueAtTime(gain, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch { /* 오디오 오류 무시 */ }
}

function playSequence(notes) {
  notes.forEach(([freq, delay, duration]) => {
    setTimeout(() => playTone({ freq, duration }), delay)
  })
}

export const setMuted = (val) => { muted = val }
export const isMuted = () => muted

export const sounds = {
  click: () => playTone({ freq: 440, duration: 0.07, gain: 0.15 }),

  correct: () => playSequence([
    [523, 0,   0.12],
    [659, 100, 0.12],
    [784, 200, 0.20],
  ]),

  wrong: () => playTone({ freq: 200, duration: 0.2, type: 'sawtooth', gain: 0.15 }),

  levelUp: () => playSequence([
    [523, 0,   0.1],
    [587, 80,  0.1],
    [659, 160, 0.1],
    [698, 240, 0.1],
    [784, 320, 0.3],
  ]),

  purify: () => playSequence([
    [784,  0,   0.15],
    [988,  120, 0.15],
    [1175, 240, 0.15],
    [1568, 360, 0.4],
  ]),

  crystal: () => playSequence([
    [523,  0,   0.1],
    [659,  100, 0.1],
    [784,  200, 0.1],
    [1047, 300, 0.1],
    [1319, 400, 0.3],
    [784,  600, 0.5],
  ]),

  coin: () => playTone({ freq: 1047, duration: 0.1, gain: 0.2 }),

  reward: () => playSequence([
    [784,  0,   0.12],
    [988,  100, 0.2],
  ]),
}
