import type { Session, Week } from '../content/types'
import { describeVolume, scaleVolume } from '../content/volume'
import { visibleExercises } from '../lib/progress'
import { today, update, useAppState } from '../lib/store'
import { IconBack, IconCheck } from '../ui/icons'
import { accentStyle, haptic } from '../ui/theme'
import { Timer } from './Timer'

export function SessionView({
  week,
  session,
  onClose,
  onComplete,
}: {
  week: Week
  session: Session
  onClose: () => void
  onComplete: (weekDone: boolean) => void
}) {
  const s = useAppState()
  const profile = s.profile!
  const done = !!s.done[session.id]
  const list = visibleExercises(session, profile.mode)
  const checked = new Set(s.checked[session.id] ?? [])
  const checkedCount = list.filter((e) => checked.has(e.id)).length
  const progress = done ? 1 : checkedCount / list.length

  function toggleExercise(id: string) {
    haptic(10)
    update((st) => {
      const cur = new Set(st.checked[session.id] ?? [])
      if (cur.has(id)) cur.delete(id)
      else cur.add(id)
      return { ...st, checked: { ...st.checked, [session.id]: [...cur] } }
    })
  }

  function finish() {
    if (done) {
      update((st) => {
        const next = { ...st.done }
        delete next[session.id]
        return { ...st, done: next }
      })
      return
    }
    haptic(40)
    const weekDone = week.sessions.every((x) => x.id === session.id || s.done[x.id])
    update((st) => ({ ...st, done: { ...st.done, [session.id]: today() } }))
    onComplete(weekDone)
  }

  return (
    <main className="screen session" style={accentStyle(week.number)}>
      <div className="session-head">
        <button className="icon-btn" onClick={onClose} aria-label="Volver">
          <IconBack size={22} />
        </button>
        <div
          className="session-progress"
          role="progressbar"
          aria-label="Avance de la sesión"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <span className="muted small tabular">
          {done ? list.length : checkedCount}/{list.length}
        </span>
      </div>

      <div className="session-hero">
        <p className="eyebrow">
          Semana {week.number} · {session.title}
        </p>
        <h1 className="title">{session.focus}</h1>
      </div>

      {session.kind === 'tenis' && week.chapter && (
        <details className="card keys">
          <summary>
            <span>Lo más importante</span>
            <span className="muted small">Capítulo {week.chapter.number}</span>
          </summary>
          <ol>
            {week.chapter.keys.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ol>
        </details>
      )}

      <ol className="exercises stagger">
        {list.map((ex, i) => {
          const v = scaleVolume(ex, profile.level)
          const specific = ex[profile.mode]
          const isChecked = done || checked.has(ex.id)
          return (
            <li key={ex.id} className={`card exercise ${isChecked ? 'checked' : ''}`}>
              <div className="exercise-head">
                <span className="exercise-num">{i + 1}</span>
                <div className="exercise-title">
                  <h3>{ex.name}</h3>
                  {describeVolume(v) && <p className="muted small">{describeVolume(v)}</p>}
                </div>
                <button
                  className={`check-btn ${isChecked ? 'on' : ''}`}
                  onClick={() => toggleExercise(ex.id)}
                  aria-pressed={isChecked}
                  aria-label={isChecked ? `Desmarcar ${ex.name}` : `Marcar ${ex.name} como hecho`}
                  disabled={done}
                >
                  <IconCheck size={18} />
                </button>
              </div>
              <div className="exercise-body">
                <p>{ex.how}</p>
                {specific && (
                  <p className="mode-note">
                    <span className="eyebrow">{profile.mode === 'silla' ? 'En silla' : 'De pie'}</span> {specific}
                  </p>
                )}
                {ex.goal && <p className="goal">🎯 {ex.goal}</p>}
                {v.seconds && <Timer seconds={v.seconds} sets={v.sets} rest={v.rest} />}
              </div>
            </li>
          )
        })}
      </ol>

      <button className={done ? 'ghost-btn' : 'primary big-cta'} onClick={finish}>
        {done ? 'Marcar como no hecha' : 'Terminé la sesión'}
      </button>
    </main>
  )
}
