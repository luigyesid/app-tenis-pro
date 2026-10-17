import { useEffect, useState } from 'react'

const COLORS = ['#D4E157', '#2E7D32', '#0B3D91', '#C8102E', '#FFFFFF']

/** Lluvia corta de pelotas de colores al terminar una sesión. */
export function Celebrate({ title, subtitle, onDone }: { title: string; subtitle?: string; onDone: () => void }) {
  const [pieces] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 250,
      size: 8 + Math.random() * 10,
      color: COLORS[i % COLORS.length],
      drift: (Math.random() - 0.5) * 120,
      spin: Math.random() * 540 - 270,
    })),
  )

  useEffect(() => {
    const t = window.setTimeout(onDone, 2200)
    return () => window.clearTimeout(t)
  }, [onDone])

  return (
    <div className="celebrate" role="status" onClick={onDone}>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              animationDelay: `${p.delay}ms`,
              '--drift': `${p.drift}px`,
              '--spin': `${p.spin}deg`,
            } as React.CSSProperties
          }
        />
      ))}
      <div className="celebrate-card">
        <span className="ball lg" aria-hidden />
        <strong>{title}</strong>
        {subtitle && <span className="muted">{subtitle}</span>}
      </div>
    </div>
  )
}
