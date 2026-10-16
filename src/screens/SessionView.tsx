import type { Session, Week } from '../content/types'
import { describeVolume, scaleVolume } from '../content/volume'
import { today, update, useAppState } from '../lib/store'
import { Timer } from './Timer'

export function SessionView({ week, session, onClose }: { week: Week; session: Session; onClose: () => void }) {
  const s = useAppState()
  const profile = s.profile!
  const done = !!s.done[session.id]

  function toggle() {
    update((st) => {
      const next = { ...st.done }
      if (done) delete next[session.id]
      else next[session.id] = today()
      return { ...st, done: next }
    })
    if (!done) onClose()
  }

  return (
    <main className="screen">
      <button className="link back" onClick={onClose}>
        ← Volver
      </button>
      <p className="eyebrow">
        Semana {week.number} · {session.title}
      </p>
      <h1 className="title">{session.focus}</h1>
      <ol className="exercises">
        {session.exercises.map((ex) => {
          const v = scaleVolume(ex, profile.level)
          return (
            <li key={ex.id} className="card stack">
              <div>
                <h3>{ex.name}</h3>
                <p className="muted small">{describeVolume(v)}</p>
              </div>
              <p>{ex[profile.mode] ?? ex.how}</p>
              {ex[profile.mode] && <p className="muted small">{ex.how}</p>}
              {v.seconds && <Timer seconds={v.seconds} sets={v.sets} />}
            </li>
          )
        })}
      </ol>
      <button className={done ? '' : 'primary'} onClick={toggle}>
        {done ? 'Marcar como no hecha' : 'Terminé la sesión'}
      </button>
    </main>
  )
}
