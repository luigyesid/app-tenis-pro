import { useState } from 'react'
import { useAppState } from '../lib/store'
import { Timer } from './Timer'

const presets = {
  principiante: { work: 30, rest: 30, rounds: 6 },
  intermedio: { work: 40, rest: 20, rounds: 8 },
}

export function Fitness() {
  const s = useAppState()
  const base = presets[s.profile!.level]
  const [cfg, setCfg] = useState(base)
  const set = (k: keyof typeof cfg) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCfg({ ...cfg, [k]: Math.max(1, Number(e.target.value) || 1) })

  return (
    <main className="screen">
      <p className="eyebrow">Físico</p>
      <h1 className="title">Rutina con temporizador</h1>
      <p className="muted">
        {s.profile!.mode === 'silla'
          ? 'Alterna empujes cortos, giros y sprints de silla en cada serie.'
          : 'Alterna desplazamientos laterales, split-step y sprints cortos en cada serie.'}
      </p>
      <div className="card row fields">
        <label>
          Trabajo (s)
          <input type="number" inputMode="numeric" value={cfg.work} onChange={set('work')} />
        </label>
        <label>
          Descanso (s)
          <input type="number" inputMode="numeric" value={cfg.rest} onChange={set('rest')} />
        </label>
        <label>
          Series
          <input type="number" inputMode="numeric" value={cfg.rounds} onChange={set('rounds')} />
        </label>
      </div>
      <div className="card">
        <Timer key={`${cfg.work}-${cfg.rest}-${cfg.rounds}`} seconds={cfg.work} sets={cfg.rounds} rest={cfg.rest} />
      </div>
    </main>
  )
}
