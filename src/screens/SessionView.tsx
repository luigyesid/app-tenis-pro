import type { Session, Week } from '../content/types'
import { describeVolume, scaleVolume } from '../content/volume'
import { visibleExercises } from '../lib/progress'
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
      {session.kind === 'tenis' && week.chapter && (
        <details className="card keys">
          <summary>
            Lo más importante · Capítulo {week.chapter.number}
          </summary>
          <ol>
            {week.chapter.keys.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ol>
        </details>
      )}
      <ol className="exercises">
        {visibleExercises(session, profile.mode).map((ex) => {
          const v = scaleVolume(ex, profile.level)
          const specific = ex[profile.mode]
          return (
            <li key={ex.id} className="card stack">
              <div>
                <h3>{ex.name}</h3>
                {describeVolume(v) && <p className="muted small">{describeVolume(v)}</p>}
              </div>
              <p>{ex.how}</p>
              {specific && (
                <p className="mode-note">
                  <span className="eyebrow">{profile.mode === 'silla' ? 'En silla' : 'De pie'}</span> {specific}
                </p>
              )}
              {ex.goal && <p className="goal">{ex.goal}</p>}
              {v.seconds && <Timer seconds={v.seconds} sets={v.sets} rest={v.rest} />}
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
