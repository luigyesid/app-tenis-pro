import { useState } from 'react'
import { weeks } from '../content/plan'
import type { Session, Week } from '../content/types'
import { nextSession, weekProgress } from '../lib/progress'
import { useAppState } from '../lib/store'
import { IconCheck, IconChevron } from '../ui/icons'
import { Ring } from '../ui/Ring'
import { accentStyle, haptic } from '../ui/theme'

export function Plan({ open }: { open: (w: Week, s: Session) => void }) {
  const s = useAppState()
  const current = nextSession(s)?.week.number ?? 8
  const [expanded, setExpanded] = useState<number | null>(current)

  return (
    <main className="screen stagger">
      <div>
        <p className="eyebrow">Plan</p>
        <h1 className="title">8 semanas</h1>
      </div>
      {weeks.map((w) => {
        const p = weekProgress(s, w)
        const isOpen = expanded === w.number
        const full = p.done === p.total
        return (
          <section
            key={w.number}
            className={`card week ${isOpen ? 'open' : ''} ${w.number === current ? 'current' : ''}`}
            style={accentStyle(w.number)}
          >
            <button
              className="week-head"
              aria-expanded={isOpen}
              onClick={() => {
                haptic(6)
                setExpanded(isOpen ? null : w.number)
              }}
            >
              <Ring value={p.done / p.total} size={48} stroke={5} color="var(--accent)">
                {full ? <IconCheck size={18} /> : <strong>{w.number}</strong>}
              </Ring>
              <span className="week-text">
                <strong>{w.title}</strong>
                <span className="muted small">
                  Semana {w.number} · {p.done}/{p.total} sesiones
                </span>
              </span>
              <IconChevron size={20} className="week-chevron" />
            </button>
            {isOpen && (
              <div className="week-body">
                <p className="muted small">{w.goal}</p>
                <div className="stack tight">
                  {w.sessions.map((x) => {
                    const done = !!s.done[x.id]
                    return (
                      <button key={x.id} className={`session-row ${done ? 'done' : ''}`} onClick={() => open(w, x)}>
                        <span className={done ? 'check on' : 'check'} aria-hidden>
                          {done && <IconCheck size={12} />}
                        </span>
                        <span className="session-row-text">
                          <span className="small muted">{x.title}</span>
                          <span>{x.focus}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </section>
        )
      })}
    </main>
  )
}
