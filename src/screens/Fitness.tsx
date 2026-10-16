import { useState } from 'react'
import type { Mode } from '../content/types'
import { useAppState } from '../lib/store'
import { Timer } from './Timer'

interface Preset {
  name: string
  how: string
  work: number
  rest: number
  rounds: number
  only?: Mode
}

const presets: Preset[] = [
  { name: 'Las 4 esquinas', how: 'Ve a tocar el cono que te digan y vuelve al centro.', work: 30, rest: 30, rounds: 6 },
  { name: 'Sprints cortos', how: 'Sprints de 10–15 metros.', work: 5, rest: 30, rounds: 10, only: 'pie' },
  { name: 'Arrancadas', how: 'Arrancadas explosivas de 10 metros.', work: 5, rest: 30, rounds: 10, only: 'silla' },
  { name: 'Ochos', how: 'Recorridos en 8 entre dos conos a 4 m, con la raqueta en la mano.', work: 60, rest: 30, rounds: 4, only: 'silla' },
  { name: 'Plancha', how: 'Plancha frontal, cuerpo recto.', work: 40, rest: 30, rounds: 3, only: 'pie' },
]

export function Fitness() {
  const s = useAppState()
  const mode = s.profile!.mode
  const list = presets.filter((p) => !p.only || p.only === mode)
  const [cfg, setCfg] = useState({ work: list[0].work, rest: list[0].rest, rounds: list[0].rounds })
  const [active, setActive] = useState(list[0].name)
  const set = (k: keyof typeof cfg) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCfg({ ...cfg, [k]: Math.max(1, Number(e.target.value) || 1) })
  const preset = list.find((p) => p.name === active)

  return (
    <main className="screen">
      <p className="eyebrow">Físico</p>
      <h1 className="title">Temporizador</h1>
      <div className="tabs-inline">
        {list.map((p) => (
          <button
            key={p.name}
            className={p.name === active ? 'on' : ''}
            onClick={() => {
              setActive(p.name)
              setCfg({ work: p.work, rest: p.rest, rounds: p.rounds })
            }}
          >
            {p.name}
          </button>
        ))}
      </div>
      {preset && <p className="muted">{preset.how}</p>}
      <div className="card">
        <Timer key={`${active}-${cfg.work}-${cfg.rest}-${cfg.rounds}`} seconds={cfg.work} sets={cfg.rounds} rest={cfg.rest} />
      </div>
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
      <p className="muted small">
        Calienta siempre antes y estira 5–10 minutos después. Estos ejercicios son orientativos: si algo duele, para.
      </p>
    </main>
  )
}
