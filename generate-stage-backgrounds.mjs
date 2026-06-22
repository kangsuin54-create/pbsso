// LUMOS 스테이지 교실 배경 이미지 생성 (Stage 1·2 우선)
// 실행: node --env-file=.env.local generate-stage-backgrounds.mjs
import { writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) throw new Error('GEMINI_API_KEY 환경변수가 필요합니다 (.env.local 참고)')
const MODEL = 'imagen-4.0-fast-generate-001'
const OUT_DIR = './public/stages'

const STYLE = 'cute chibi kawaii illustration game background, thick clean outlines, flat colors, atmospheric lighting, no characters, no text, children game art style, high quality, wide shot'

const STAGES = [
  {
    id: 'arke',
    prompt: `empty elementary school classroom at dusk, swirling dark navy blue shadow mist creeping between desks and chairs, eerie glowing blue fog, mysterious but not scary, rows of empty desks, chalkboard, soft blue magical glow in the corners, ${STYLE}`,
  },
  {
    id: 'envius',
    prompt: `empty elementary school hallway, swirling dark emerald green shadow mist along the lockers and floor, eerie glowing green fog, mysterious but not scary, school hallway with lockers and windows, soft green magical glow, ${STYLE}`,
  },
  {
    id: 'apelo',
    prompt: `empty elementary school playground at dusk, swirling dark red shadow mist over the jungle gym and swings, eerie glowing red fog, mysterious but not scary, soft red magical glow, ${STYLE}`,
  },
  {
    id: 'ikarima',
    prompt: `empty elementary school auditorium stage, swirling dark amber orange shadow mist drifting over rows of seats, eerie glowing orange fog, mysterious but not scary, soft amber magical glow, ${STYLE}`,
  },
  {
    id: 'mianta',
    prompt: `empty elementary school library, swirling dark violet purple shadow mist between tall bookshelves, eerie glowing purple fog, mysterious but not scary, soft purple magical glow, ${STYLE}`,
  },
  {
    id: 'bukris',
    prompt: `empty elementary school art room, swirling dark pink shadow mist around easels and sculptures, eerie glowing pink fog, mysterious but not scary, soft pink magical glow, ${STYLE}`,
  },
  {
    id: 'kurayami',
    prompt: `empty elementary school science lab, swirling dark cyan blue shadow mist between lab tables and beakers, eerie glowing cyan fog, mysterious but not scary, soft cyan magical glow, ${STYLE}`,
  },
  {
    id: 'netasion',
    prompt: `empty elementary school counseling room, swirling soft lavender white shadow mist around a cozy sofa and mirror, eerie glowing lavender fog, mysterious but not scary, soft lavender magical glow, ${STYLE}`,
  },
]

async function generateImage(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1 } }),
    }
  )
  const data = await res.json()
  if (data.error) throw new Error(JSON.stringify(data.error))
  return data.predictions[0].bytesBase64Encoded
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

console.log(`\n🎨 LUMOS 스테이지 배경 ${STAGES.length}개 생성 시작 (Imagen 4)...\n`)

let success = 0, fail = 0

for (const stage of STAGES) {
  const outPath = join(OUT_DIR, `${stage.id}.jpg`)
  if (existsSync(outPath)) {
    console.log(`  ⏭️  ${stage.id} (이미 존재, 스킵)`)
    continue
  }
  try {
    process.stdout.write(`  ⏳ ${stage.id} ... `)
    const b64 = await generateImage(stage.prompt)
    const buf = Buffer.from(b64, 'base64')
    writeFileSync(join(OUT_DIR, `${stage.id}.jpg`), buf)
    console.log(`✅ (${(buf.length / 1024).toFixed(0)}KB)`)
    success++
    await sleep(500)
  } catch (err) {
    console.log(`❌ ${err.message.slice(0, 100)}`)
    fail++
    await sleep(1000)
  }
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
console.log(`✅ 성공: ${success}개  ❌ 실패: ${fail}개`)
console.log(`📁 위치: ${OUT_DIR}\n`)
