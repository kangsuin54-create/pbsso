import { writeFileSync } from 'fs'
import { join } from 'path'

const API_KEY = 'AIzaSyAiEIUdtRiyNY-M899cW3XppmkIDYXw-oc'
const MODEL = 'imagen-4.0-fast-generate-001'
const OUT_DIR = './public/items'

const STYLE = 'cute chibi kawaii illustration, bright pastel colors, thick clean outlines, flat colors, white background, no shadows, children game art style, high quality'

const ITEMS = [
  // ── 베이스 캐릭터 (남/여) - 모자 없음, 흰 배경 ──
  {
    id: 'character_male',
    prompt: `cute chibi boy wizard character, full body front view, NO HAT bare head short spiky brown hair only, blue magical robe with gold trim, holding a glowing magic wand, big sparkling brown eyes, rosy cheeks, warm smile, centered, pure white background, isolated character, ${STYLE}`,
  },
  {
    id: 'character_female',
    prompt: `cute chibi girl wizard character, full body front view, NO HAT bare head long twin-tail pink hair with small ribbon clips only, pink magical robe with white trim, holding a glowing magic wand, big sparkling purple eyes, rosy cheeks, sweet smile, centered, pure white background, isolated character, ${STYLE}`,
  },

  // ── 모자 ──
  {
    id: 'hat_baseball',
    prompt: `sky blue baseball cap hat, cute game item icon, slightly angled top view, stitching details, ${STYLE}`,
  },
  {
    id: 'hat_tophat',
    prompt: `shiny black top hat with red ribbon band, cute game item icon, slightly angled view, elegant, ${STYLE}`,
  },
  {
    id: 'hat_grad',
    prompt: `black graduation mortarboard cap with yellow tassel, cute game item icon, slightly angled view, ${STYLE}`,
  },
  {
    id: 'hat_crown',
    prompt: `sparkling golden crown with colorful gems, cute game item icon, front view, royal, glittering jewels, ${STYLE}`,
  },
  {
    id: 'hat_wizard',
    prompt: `tall purple wizard hat with golden stars and moons pattern, cute game item icon, slightly angled view, magical sparkles around it, ${STYLE}`,
  },
  {
    id: 'hat_santa',
    prompt: `red Santa hat with white fluffy trim and white pompom, cute game item icon, slightly angled view, festive, ${STYLE}`,
  },

  // ── 액세서리 ──
  {
    id: 'acc_glasses',
    prompt: `cute round glasses with thin golden frames, game item icon, front view flat, ${STYLE}`,
  },
  {
    id: 'acc_sunglasses',
    prompt: `cool heart-shaped pink sunglasses, game item icon, front view flat, fun stylish, ${STYLE}`,
  },
  {
    id: 'acc_ribbon',
    prompt: `large cute pink ribbon bow with sparkles, game item icon, front view flat, fluffy, ${STYLE}`,
  },
  {
    id: 'acc_necklace',
    prompt: `sparkling blue diamond necklace on gold chain, game item icon, front view, glittering gem, ${STYLE}`,
  },
  {
    id: 'acc_bow',
    prompt: `cute purple butterfly bowtie, game item icon, front view flat, fancy adorable, ${STYLE}`,
  },
  {
    id: 'acc_medal',
    prompt: `shiny gold medal number 1 on colorful ribbon, game item icon, front view, champion award, ${STYLE}`,
  },

  // ── 동반자 ──
  {
    id: 'pet_cat',
    prompt: `tiny cute white chibi cat, full body front facing, big blue eyes, sitting pose, fluffy tail curled up, ${STYLE}`,
  },
  {
    id: 'pet_dog',
    prompt: `tiny cute golden chibi puppy, full body front facing, floppy ears, happy expression, sitting, ${STYLE}`,
  },
  {
    id: 'pet_dragon',
    prompt: `tiny cute baby dragon, green scales, small wings, big innocent eyes, friendly smile, full body front facing, ${STYLE}`,
  },
  {
    id: 'pet_unicorn',
    prompt: `tiny cute miniature unicorn, white with rainbow mane, golden horn, full body front facing, magical sparkles, ${STYLE}`,
  },
  {
    id: 'pet_star',
    prompt: `tiny cute star fairy, glowing yellow star body, little wings, big sparkly eyes, floating pose, ${STYLE}`,
  },
  {
    id: 'pet_robot',
    prompt: `tiny cute mini robot, round head, small body, friendly LED eyes, full body front facing, pastel blue metal, ${STYLE}`,
  },

  // ── 배경 ──
  {
    id: 'bg_rainbow',
    prompt: `cute cartoon rainbow landscape, colorful rainbow over green hills, fluffy clouds, bright sunny sky, flat game background, no characters, ${STYLE}`,
  },
  {
    id: 'bg_star',
    prompt: `cute cartoon magical night sky, twinkling stars, crescent moon, soft aurora colors, dreamy purple pink gradient, flat game background, no characters, ${STYLE}`,
  },
  {
    id: 'bg_flower',
    prompt: `cute cartoon cherry blossom garden, pink sakura petals falling, soft pink trees, flat game background, no characters, ${STYLE}`,
  },
  {
    id: 'bg_ocean',
    prompt: `cute cartoon ocean beach, gentle blue waves, sandy beach, sea shells, bright sun, flat game background, no characters, ${STYLE}`,
  },
  {
    id: 'bg_forest',
    prompt: `cute cartoon magical forest, tall green trees, glowing mushrooms, fireflies, soft light rays, flat game background, no characters, ${STYLE}`,
  },
  {
    id: 'bg_fire',
    prompt: `cute cartoon cozy campfire scene, bright orange flames, warm glowing embers, starry night sky, flat game background, no characters, ${STYLE}`,
  },
]

async function generateImage(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1 },
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(JSON.stringify(data.error))
  return data.predictions[0].bytesBase64Encoded
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

console.log(`\n🎨 총 ${ITEMS.length}개 이미지 생성 시작 (Imagen 4)...\n`)

let success = 0, fail = 0

for (const item of ITEMS) {
  try {
    process.stdout.write(`  ⏳ [${String(success + fail + 1).padStart(2, '0')}/${ITEMS.length}] ${item.id} ... `)
    const b64 = await generateImage(item.prompt)
    const buf = Buffer.from(b64, 'base64')
    writeFileSync(join(OUT_DIR, `${item.id}.jpg`), buf)
    console.log(`✅ (${(buf.length / 1024).toFixed(0)}KB)`)
    success++
    await sleep(500)
  } catch (err) {
    console.log(`❌ ${err.message.slice(0, 80)}`)
    fail++
    await sleep(1000)
  }
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
console.log(`✅ 성공: ${success}개  ❌ 실패: ${fail}개`)
console.log(`📁 위치: ${OUT_DIR}\n`)
