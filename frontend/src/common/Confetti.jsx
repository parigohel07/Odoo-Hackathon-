import { useMemo } from 'react'

const COLORS = ['#ab8cf2', '#f38bb0', '#5fc5aa', '#e8ac60', '#8fdcc6', '#f2cb8e']

// Deterministic pseudo-random in [0, 1) — pure, so renders stay stable.
function rand(seed) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

export default function Confetti({ pieces = 70, seed = 0 }) {
  const bits = useMemo(
    () =>
      Array.from({ length: pieces }, (_, index) => {
        const s = seed * 131 + index * 7919
        return {
          id: index,
          left: rand(s + 1) * 100,
          delay: rand(s + 2) * 1.4,
          duration: 2 + rand(s + 3) * 1.8,
          drift: (rand(s + 4) - 0.5) * 260,
          size: 6 + rand(s + 5) * 9,
          color: COLORS[index % COLORS.length],
          round: rand(s + 6) > 0.7,
        }
      }),
    [pieces, seed],
  )

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {bits.map((bit) => (
        <span
          key={bit.id}
          className="animate-confetti absolute top-0 block"
          style={{
            left: `${bit.left}%`,
            width: bit.size,
            height: bit.round ? bit.size : bit.size * 0.45,
            backgroundColor: bit.color,
            borderRadius: bit.round ? '9999px' : '2px',
            animationDelay: `${bit.delay}s`,
            animationDuration: `${bit.duration}s`,
            '--drift': `${bit.drift}px`,
          }}
        />
      ))}
    </div>
  )
}
