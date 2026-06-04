// 캐릭터 이미지만 재생성 (모자 없음 + 흰 배경)
const API_KEY = 'AIzaSyAiEIUdtRiyNY-M899cW3XppmkIDYXw-oc'
const MODEL   = 'imagen-4.0-fast-generate-001'
const STYLE   = 'cute chibi kawaii illustration, bright pastel colors, thick clean outlines, flat colors, pure white background, no shadows, no background scene, isolated character only, children game art style, high quality'

const CHARS = [
  {
    id: 'character_male',
    prompt: `cute chibi boy wizard character, full body front facing, NO HAT bare head short spiky brown hair only, blue magical robe with gold trim, holding a glowing magic wand in right hand, big sparkling brown eyes, rosy cheeks, warm smile, centered, pure white background, isolated on white, ${STYLE}`,
  },
  {
    id: 'character_female',
    prompt: `cute chibi girl wizard character, full body front facing, NO HAT bare head long twin-tail pink hair with small ribbon hair clips only, pink magical robe with white trim, holding a glowing magic wand in right hand, big sparkling purple eyes, rosy cheeks, sweet smile, centered, pure white background, isolated on white, ${STYLE}`,
  },
]

const sleep = ms => new Promise(r => setTimeout(r, ms))

import { writeFileSync } from 'fs'
import { join } from 'path'

console.log('\n🎨 캐릭터 이미지 재생성 (모자 없음 + 흰 배경)...\n')

for (const char of CHARS) {
  try {
    process.stdout.write(`  ⏳ ${char.id} 생성 중... `)
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instances: [{ prompt: char.prompt }], parameters: { sampleCount: 1 } }),
      }
    )
    const data = await res.json()
    if (data.error) throw new Error(JSON.stringify(data.error))
    const buf = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64')
    writeFileSync(join('./public/items', `${char.id}.jpg`), buf)
    console.log(`✅ (${(buf.length/1024).toFixed(0)}KB)`)
    await sleep(800)
  } catch (err) {
    console.log(`❌ ${err.message}`)
  }
}

console.log('\n✅ 완료! 이제 배포하세요.\n')
