import { useState } from 'react'

export default function MonsterImage({ src, emoji, size = 72, style }) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return <span style={{ fontSize: size, lineHeight: 1, ...style }}>{emoji}</span>
  }

  return (
    <img
      src={src}
      alt=""
      onError={() => setError(true)}
      style={{ width: size, height: size, objectFit: 'contain', ...style }}
    />
  )
}
