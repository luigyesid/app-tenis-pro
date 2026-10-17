import { useState } from 'react'
import type { Mode } from '../content/types'
import { useAppState } from '../lib/store'
import { ExerciseIllustration } from '../ui/Illustrations'
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
  { name: 'Giros y frenadas', how: 'Empuja adelante, frena y gira: adelante con una mano y atrás con la otra.', work: 30, rest: 30, rounds: 4, only: 'silla' },
  { name: 'Desplazamientos laterales', how: 'Pasos laterales rápidos de lado a lado, sin cruzar los pies, y vuelve al centro.', work: 20, rest: 20, rounds: 6, only: 'pie' },
  { name: 'Saltar la cuerda', how: 'Saltos cortos sobre la punta de los pies, con las rodillas suaves.', work: 30, rest: 30, rounds: 6, only: 'pie' },
  { name: 'Skipping', how: 'Sube las rodillas a la altura de la cadera a ritmo rápido, moviendo los brazos.', work: 20, rest: 20, rounds: 6, only: 'pie' },
  { name: 'Sentadillas', how: 'Pies al ancho de hombros, baja como para sentarte y sube con fuerza. Espalda recta.', work: 30, rest: 30, rounds: 4, only: 'pie' },
  { name: 'Zancadas', how: 'Da un paso largo adelante y baja hasta que ambas rodillas queden en ángulo recto. Alterna piernas.', work: 30, rest: 30, rounds: 3, only: 'pie' },
  { name: 'Plancha', how: 'Plancha frontal, cuerpo recto.', work: 40, rest: 30, rounds: 3, only: 'pie' },
  { name: 'Core sentado', how: 'Sentado y firme en la silla, contrae el abdomen y rota el tronco a cada lado.', work: 40, rest: 30, rounds: 3, only: 'silla' },
  { name: 'Empuje continuo', how: 'Empuja la silla a ritmo constante alrededor de la cancha, sin parar.', work: 120, rest: 30, rounds: 5, only: 'silla' },
  { name: 'Sombra de golpes', how: 'Derecha y revés al aire, alternando, con buena técnica y recuperando después de cada golpe.', work: 45, rest: 15, rounds: 6 },
  { name: 'Rotaciones con balón medicinal', how: 'Balón liviano en las manos, gira el tronco de arriba abajo cruzando el cuerpo, como un leñador.', work: 30, rest: 30, rounds: 3 },
  { name: 'Rotación externa con banda', how: 'Codo pegado al cuerpo, rota el antebrazo hacia afuera contra la banda. Cambia de brazo en cada serie.', work: 40, rest: 20, rounds: 4 },
  { name: 'Remo con banda', how: 'Jala la banda hacia el pecho juntando las escápulas.', work: 40, rest: 20, rounds: 3 },
]

export function Fitness() {
  const s = useAppState()
  const mode = s.profile!.mode
  const list = presets.filter((p) => !p.only || p.only === mode)
  const [raw, setRaw] = useState(toRaw(list[0]))
  const [active, setActive] = useState(list[0].name)
  const set = (k: keyof typeof raw) => (e: React.ChangeEvent<HTMLInputElement>) => setRaw({ ...raw, [k]: e.target.value })
  // Lo que se escribe se guarda tal cual y se ajusta a valores razonables para el temporizador.
  const cfg = {
    work: clamp(raw.work, 1, 3600, 30),
    rest: clamp(raw.rest, 0, 600, 30),
    rounds: clamp(raw.rounds, 1, 30, 1),
  }
  const preset = list.find((p) => p.name === active)

  return (
    <main className="screen stagger">
      <div>
        <p className="eyebrow">Físico</p>
        <h1 className="title">Temporizador</h1>
      </div>
      <div className="tabs-inline">
        {list.map((p) => (
          <button
            key={p.name}
            className={p.name === active ? 'on' : ''}
            onClick={() => {
              setActive(p.name)
              setRaw(toRaw(p))
            }}
          >
            {p.name}
          </button>
        ))}
      </div>
      <div className="card timer-card">
        <Timer key={`${active}-${cfg.work}-${cfg.rest}-${cfg.rounds}`} seconds={cfg.work} sets={cfg.rounds} rest={cfg.rest} />
      </div>
      {preset && (
        <div className="card stack preset-card">
          <ExerciseIllustration name={preset.name} mode={mode} />
          <p>{preset.how}</p>
        </div>
      )}
      <div className="card row fields">
        <label>
          Trabajo (s)
          <input type="number" inputMode="numeric" min={1} max={3600} step={1} value={raw.work} onChange={set('work')} />
        </label>
        <label>
          Descanso (s)
          <input type="number" inputMode="numeric" min={0} max={600} step={1} value={raw.rest} onChange={set('rest')} />
        </label>
        <label>
          Series
          <input type="number" inputMode="numeric" min={1} max={30} step={1} value={raw.rounds} onChange={set('rounds')} />
        </label>
      </div>
      <p className="muted small">
        Calienta siempre antes y estira 5–10 minutos después. Estos ejercicios son orientativos: si algo duele, para.
      </p>
    </main>
  )
}

function toRaw(p: Preset) {
  return { work: String(p.work), rest: String(p.rest), rounds: String(p.rounds) }
}

function clamp(v: string, min: number, max: number, fallback: number) {
  const n = Math.round(Number(v))
  if (v.trim() === '' || !Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}
