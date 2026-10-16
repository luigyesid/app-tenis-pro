import { weeks } from '../content/plan'
import type { Session, Week } from '../content/types'
import { weekProgress } from '../lib/progress'
import { useAppState } from '../lib/store'

export function Plan({ open }: { open: (w: Week, s: Session) => void }) {
  const s = useAppState()
  return (
    <main className="screen">
      <p className="eyebrow">Plan</p>
      <h1 className="title">8 semanas</h1>
      {weeks.map((w) => {
        const p = weekProgress(s, w)
        return (
          <section key={w.number} className="card stack">
            <div className="row between">
              <strong>
                Semana {w.number}: {w.title}
              </strong>
              <span className="muted small">
                {p.done}/{p.total}
              </span>
            </div>
            <p className="muted small">{w.goal}</p>
            <div className="stack tight">
              {w.sessions.map((x) => (
                <button key={x.id} className="session-row" onClick={() => open(w, x)}>
                  <span className={s.done[x.id] ? 'check on' : 'check'} aria-hidden />
                  <span>
                    {x.title}: {x.focus}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
