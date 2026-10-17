import { weeks } from '../content/plan'
import type { Session, Week } from '../content/types'
import { describeVolume, estimateMinutes, scaleVolume } from '../content/volume'
import { doneToday, nextSession, visibleExercises, weekProgress } from '../lib/progress'
import { useAppState } from '../lib/store'
import { IconChevron, IconFlame, IconPlay } from '../ui/icons'
import { Ring } from '../ui/Ring'
import { accentStyle, greeting } from '../ui/theme'

export function Today({ open }: { open: (w: Week, s: Session) => void }) {
  const s = useAppState()
  const next = nextSession(s)
  const trainedToday = doneToday(s)
  const totalDone = Object.keys(s.done).length
  const totalSessions = weeks.reduce((a, w) => a + w.sessions.length, 0)

  if (!next) {
    return (
      <main className="screen stagger">
        <p className="eyebrow">{greeting()}</p>
        <h1 className="title">¡Completaste las 8 semanas! 🏆</h1>
        <p className="muted">Repite la medición en Medir para ver cuánto mejoraste, y vuelve a las sesiones que más te sirvieron.</p>
        <StreakCard total={totalDone} trainedToday={trainedToday} />
      </main>
    )
  }

  const { week, session } = next
  const p = weekProgress(s, week)
  const exercises = visibleExercises(session, s.profile!.mode)
  const minutes = estimateMinutes(exercises, s.profile!.level)
  const index = week.sessions.indexOf(session) + 1

  return (
    <main className="screen stagger">
      <div>
        <p className="eyebrow">{greeting()}</p>
        <h1 className="title">{trainedToday ? 'Ya entrenaste hoy. ¿Vas por otra?' : 'Hoy toca'}</h1>
      </div>

      <button className="hero" style={accentStyle(week.number)} onClick={() => open(week, session)}>
        <span className="hero-court" aria-hidden />
        <span className="hero-top">
          <span className="tag">
            Semana {week.number} · Sesión {index}/{week.sessions.length}
          </span>
          <span className="tag ghost">{session.kind === 'fisico' ? 'Físico' : 'Tenis'}</span>
        </span>
        <span className="hero-title">{session.focus}</span>
        <span className="hero-meta">
          {exercises.length} ejercicios · ~{minutes} min
        </span>
        <span className="hero-list">
          {exercises.slice(0, 4).map((ex) => {
            const v = describeVolume(scaleVolume(ex, s.profile!.level))
            return (
              <span key={ex.id}>
                {ex.name}
                {v && <em> · {v}</em>}
              </span>
            )
          })}
          {exercises.length > 4 && <span>+{exercises.length - 4} más</span>}
        </span>
        <span className="hero-cta">
          <IconPlay size={18} /> Empezar
        </span>
      </button>

      <div className="grid-2">
        <StreakCard total={totalDone} trainedToday={trainedToday} />
        <div className="card stat">
          <Ring value={p.done / p.total} size={56} color="var(--ball)">
            <strong>{p.done}</strong>
          </Ring>
          <span className="stat-text">
            <strong>de {p.total}</strong>
            <span className="muted small">semana {week.number}</span>
          </span>
        </div>
      </div>

      <section className="card stack">
        <div className="row between">
          <strong>Tu camino</strong>
          <span className="muted small">
            {totalDone}/{totalSessions} sesiones
          </span>
        </div>
        <div className="path" role="img" aria-label={`Avance: ${totalDone} de ${totalSessions} sesiones`}>
          {weeks.map((w) => {
            const wp = weekProgress(s, w)
            const current = w.number === week.number
            return (
              <div
                key={w.number}
                className={`path-step ${wp.done === wp.total ? 'full' : ''} ${current ? 'current' : ''}`}
                style={accentStyle(w.number)}
                title={`Semana ${w.number}: ${w.title}`}
              >
                <span className="path-fill" style={{ transform: `scaleY(${wp.done / wp.total})` }} />
                <span className="path-num">{w.number}</span>
              </div>
            )
          })}
        </div>
        <button className="link-row" onClick={() => open(week, session)}>
          <span>
            <strong>Semana {week.number}: {week.title}</strong>
            <span className="muted small block">{week.goal}</span>
          </span>
          <IconChevron size={20} />
        </button>
      </section>
    </main>
  )
}

function StreakCard({ total, trainedToday }: { total: number; trainedToday: boolean }) {
  return (
    <div className={`card stat streak ${trainedToday ? 'lit' : ''}`}>
      <span className="flame">
        <IconFlame size={30} />
      </span>
      <span className="stat-text">
        <strong key={total} className="streak-num pop">
          {total}
        </strong>
        <span className="muted small">{total === 1 ? 'sesión hecha' : 'sesiones hechas'}</span>
      </span>
    </div>
  )
}
