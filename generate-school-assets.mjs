// 학교 외관(어둠/밝음), 복도, 8개 NPC 초상화 생성
// 실행: node --env-file=.env.local generate-school-assets.mjs
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) throw new Error('GEMINI_API_KEY 환경변수가 필요합니다 (.env.local 참고)')
const MODEL = 'imagen-4.0-fast-generate-001'

const SCENE_STYLE = 'cute chibi kawaii illustration game background, thick clean outlines, flat colors, atmospheric lighting, no characters, no text, children game art style, high quality, wide shot'
const NPC_STYLE = 'cute chibi kawaii illustration, full body front facing, bright pastel colors, thick clean outlines, flat colors, pure white background, isolated character only, children game art style, high quality, friendly warm expression'

const ASSETS = [
  {
    out: 'school/exterior_dark.jpg',
    prompt: `elementary school building exterior at night, swirling dark purple-blue shadow mist engulfing the building, all windows dark except one faint flicker, eerie glowing fog around the entrance, mysterious but not scary, ${SCENE_STYLE}`,
  },
  {
    out: 'school/exterior_bright.jpg',
    prompt: `elementary school building exterior at dusk, every window glowing warmly with golden light, sparkling magical light rays bursting from the building, joyful and triumphant atmosphere, rainbow glow in the sky, ${SCENE_STYLE}`,
  },
  {
    out: 'school/corridor.jpg',
    prompt: `empty elementary school hallway stretching into the distance, polished floor, tall windows on one side with soft light, rows of lockers, no doors, no characters, no text, wide horizontal corridor view, ${SCENE_STYLE}`,
  },
  {
    out: 'npcs/arke.jpg',
    prompt: `cute chibi elementary school class president boy, wearing a class president armband, short neat hair, confident friendly smile, ${NPC_STYLE}`,
  },
  {
    out: 'npcs/envius.jpg',
    prompt: `cute chibi school discipline teacher woman, neat bun hairstyle, glasses, holding a clipboard, stern but kind expression, ${NPC_STYLE}`,
  },
  {
    out: 'npcs/apelo.jpg',
    prompt: `cute chibi PE teacher man, wearing tracksuit and whistle around neck, athletic build, energetic smile, ${NPC_STYLE}`,
  },
  {
    out: 'npcs/ikarima.jpg',
    prompt: `cute chibi dance club senior girl student, ponytail hair, wearing dance practice outfit, graceful pose, warm smile, ${NPC_STYLE}`,
  },
  {
    out: 'npcs/mianta.jpg',
    prompt: `cute chibi school librarian woman, round glasses, cardigan, holding a stack of books, gentle calm expression, ${NPC_STYLE}`,
  },
  {
    out: 'npcs/bukris.jpg',
    prompt: `cute chibi classical marble statue character come to life, smooth white stone texture with soft glowing cracks, friendly gentle expression, art room sculpture style, ${NPC_STYLE}`,
  },
  {
    out: 'npcs/kurayami.jpg',
    prompt: `cute chibi friendly cartoon skeleton anatomy model from a science classroom, round smooth bones, big round eyes, not scary, charming smile, ${NPC_STYLE}`,
  },
  {
    out: 'npcs/netasion.jpg',
    prompt: `cute chibi school counselor teacher woman, soft cardigan, warm gentle smile, kind caring eyes, holding a small cup of tea, ${NPC_STYLE}`,
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

console.log(`\n🎨 학교 에셋 ${ASSETS.length}개 생성 시작 (Imagen 4)...\n`)

let success = 0, fail = 0

for (const asset of ASSETS) {
  const outPath = join('./public', asset.out)
  mkdirSync(join('./public', asset.out.split('/')[0]), { recursive: true })
  if (existsSync(outPath)) {
    console.log(`  ⏭️  ${asset.out} (이미 존재, 스킵)`)
    continue
  }
  try {
    process.stdout.write(`  ⏳ ${asset.out} ... `)
    const b64 = await generateImage(asset.prompt)
    const buf = Buffer.from(b64, 'base64')
    writeFileSync(outPath, buf)
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
console.log(`📁 위치: ./public/school, ./public/npcs\n`)
