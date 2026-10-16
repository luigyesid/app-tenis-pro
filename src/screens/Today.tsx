import { weeks } from '../content/plan'
import { describeVolume, estimateMinutes, scaleVolume } from '../content/volume'
import type { Session, Week } from '../content/types'
import { doneToday, nextSession, streak, visibleExercises, weekProgress } from '../lib/progress'
import { useAppState } from '../lib/store'

export function Today({ open }: { open: (w: Week, s: Session) => void }) {
  const s = useAppState()
  const next = nextSession(s)
  const days = streak(s)
  const trainedToday = doneToday(s)

  if (!next) {
    return (
      <main className="screen">
        <p className="eyebrow">Hoy toca</p>
        <h1 className="title">¡Completaste las 8 semanas!</h1>
        <p className="muted">Sigue midiendo tus golpes y repite las sesiones que más te sirvieron desde Plan.</p>
        <Streak days={days} />
      </main>
    )
  }

  const { week, session } = next
  const p = weekProgress(s, week)
  const exercises = visibleExercises(session, s.profile!.mode)
  const minutes = estimateMinutes(exercises, s.profile!.level)

  return (
    <main className="screen">
      <p className="eyebrow">Hoy toca</p>
      <h1 className="title">{trainedToday ? 'Ya entrenaste hoy. ¿Vas por otra?' : session.focus}</h1>

      <button className="card today-card" onClick={() => open(week, session)}>
        <span className="eyebrow">
          Semana {week.number} · Sesión {week.sessions.indexOf(session) + 1} de {week.sessions.length}
        </span>
        <strong>
          {session.title}: {session.focus}
        </strong>
        <span className="muted small">
          {exercises.length} ejercicios · unos {minutes} min
        </span>
        <ul className="muted small">
          {exercises.map((ex) => {
            const v = describeVolume(scaleVolume(ex, s.profile!.level))
            return (
              <li key={ex.id}>
                {ex.name}
                {v && ` · ${v}`}
              </li>
            )
          })}
        </ul>
        <span className="primary pill">Empezar</span>
      </button>

      <div className="card stack">
        <div className="row between">
          <strong>Semana {week.number}: {week.title}</strong>
          <span className="muted small">
            {p.done} de {p.total}
          </span>
        </div>
        <div className="bar">
          <span style={{ width: `${(p.done / p.total) * 100}%` }} />
        </div>
        <p className="muted small">{week.goal}</p>
      </div>

      <Streak days={days} />

      <div className="weeks-strip" aria-label="Avance del plan">
        {weeks.map((w) => {
          const wp = weekProgress(s, w)
          return (
            <span key={w.number} className={wp.done === wp.total ? 'full' : wp.done ? 'half' : ''}>
              {w.number}
            </span>
          )
        })}
      </div>
    </main>
  )
}

function Streak({ days }: { days: number }) {
  return (
    <div className="card row streak">
      <span className="streak-num">{days}</span>
      <span>
        {days === 0
          ? 'Termina una sesión hoy para empezar tu racha.'
          : days === 1
            ? 'día seguido entrenando. Vuelve mañana para mantenerla.'
            : 'días seguidos entrenando.'}
      </span>
    </div>
  )
}
