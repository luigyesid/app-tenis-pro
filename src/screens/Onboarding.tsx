import { useState } from 'react'
import type { Level, Mode } from '../content/types'
import { update } from '../lib/store'
import { IconSpark, IconStanding, IconWheelchair } from '../ui/icons'
import { haptic } from '../ui/theme'

export function Onboarding({ initial }: { initial?: { mode: Mode; level: Level } }) {
  const [mode, setMode] = useState<Mode | null>(initial?.mode ?? null)

  function chooseLevel(level: Level) {
    if (!mode) return
    haptic(20)
    update((s) => ({ ...s, profile: { mode, level } }))
  }

  if (!mode) {
    return (
      <main key="mode" className="screen center stagger">
        <p className="eyebrow center-text">Paso 1 de 2</p>
        <h1 className="title center-text">¿De pie o en silla?</h1>
        <p className="muted center-text">Adapto cada ejercicio a cómo juegas.</p>
        <div className="choices">
          <button className="choice" style={{ '--accent': 'var(--green)' } as React.CSSProperties} onClick={() => setMode('pie')}>
            <span className="choice-icon">
              <IconStanding size={30} />
            </span>
            <span className="choice-text">
              <strong>De pie</strong>
              <span className="muted small">Tenis convencional</span>
            </span>
          </button>
          <button className="choice" style={{ '--accent': 'var(--blue)' } as React.CSSProperties} onClick={() => setMode('silla')}>
            <span className="choice-icon">
              <IconWheelchair size={30} />
            </span>
            <span className="choice-text">
              <strong>En silla</strong>
              <span className="muted small">Tenis en silla de ruedas, con dos botes</span>
            </span>
          </button>
        </div>
      </main>
    )
  }

  return (
    <main key="level" className="screen center stagger">
      <p className="eyebrow center-text">Paso 2 de 2</p>
      <h1 className="title center-text">¿Cuál es tu nivel?</h1>
      <p className="muted center-text">Ajusto las series, repeticiones y tiempos a tu nivel.</p>
      <div className="choices">
        <button className="choice" style={{ '--accent': 'var(--ball)' } as React.CSSProperties} onClick={() => chooseLevel('principiante')}>
          <span className="choice-icon">
            <span className="ball sm" />
          </span>
          <span className="choice-text">
            <strong>Principiante</strong>
            <span className="muted small">Juego hace poco o sin entrenador</span>
          </span>
        </button>
        <button className="choice" style={{ '--accent': 'var(--red)' } as React.CSSProperties} onClick={() => chooseLevel('intermedio')}>
          <span className="choice-icon">
            <IconSpark size={28} />
          </span>
          <span className="choice-text">
            <strong>Intermedio</strong>
            <span className="muted small">Peloteo con constancia y juego partidos</span>
          </span>
        </button>
      </div>
      <button className="link center-self" onClick={() => setMode(null)}>
        Volver
      </button>
    </main>
  )
}
