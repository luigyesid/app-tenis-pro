import { useState } from 'react'
import type { Level, Mode } from '../content/types'
import { update } from '../lib/store'

export function Onboarding({ initial }: { initial?: { mode: Mode; level: Level } }) {
  const [mode, setMode] = useState<Mode | null>(initial?.mode ?? null)

  function chooseLevel(level: Level) {
    if (!mode) return
    update((s) => ({ ...s, profile: { mode, level } }))
  }

  if (!mode) {
    return (
      <main className="screen center">
        <h1 className="title">¿De pie o en silla?</h1>
        <p className="muted center-text">Adapto cada ejercicio a cómo juegas.</p>
        <div className="choices">
          <button className="choice" onClick={() => setMode('pie')}>
            <strong>De pie</strong>
            <span className="muted small">Tenis convencional</span>
          </button>
          <button className="choice" onClick={() => setMode('silla')}>
            <strong>En silla</strong>
            <span className="muted small">Tenis en silla de ruedas, con dos botes</span>
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="screen center">
      <h1 className="title">¿Cuál es tu nivel?</h1>
      <p className="muted center-text">Ajusto las series, repeticiones y tiempos a tu nivel.</p>
      <div className="choices">
        <button className="choice" onClick={() => chooseLevel('principiante')}>
          <strong>Principiante</strong>
          <span className="muted small">Juego hace poco o sin entrenador</span>
        </button>
        <button className="choice" onClick={() => chooseLevel('intermedio')}>
          <strong>Intermedio</strong>
          <span className="muted small">Pelotero con constancia y juego partidos</span>
        </button>
      </div>
      <button className="link" onClick={() => setMode(null)}>
        Volver
      </button>
    </main>
  )
}
