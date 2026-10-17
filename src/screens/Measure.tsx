import { useState } from 'react'
import { controlTests } from '../content/plan'
import type { ControlTest } from '../content/types'
import { today, update, useAppState } from '../lib/store'
import { IconChevron } from '../ui/icons'
import { Ring } from '../ui/Ring'
import { haptic } from '../ui/theme'

export function Measure() {
  const s = useAppState()
  const [open, setOpen] = useState<string | null>(null)
  // Conteos en curso por prueba, para no perderlos al abrir otra tarjeta.
  const [tallies, setTallies] = useState<Record<string, Tally>>({})

  return (
    <main className="screen stagger">
      <div>
        <p className="eyebrow">Medir</p>
        <h1 className="title">Tabla de control</h1>
      </div>
      <p className="muted">Haz estas pruebas en la semana 1 y repítelas en la semana 8. Lo que no se mide, no mejora.</p>
      {controlTests.map((t) => {
        const logs = s.measures.filter((m) => m.testId === t.id)
        const first = logs[0]
        const last = logs[logs.length - 1]
        const isOpen = open === t.id
        return (
          <section key={t.id} className={`card stack test ${isOpen ? 'open' : ''}`}>
            <button className="test-head" onClick={() => setOpen(isOpen ? null : t.id)} aria-expanded={isOpen}>
              <span>
                <strong>{t.name}</strong>
                <span className="muted small block">
                  {!first
                    ? 'Sin medir'
                    : logs.length === 1
                      ? `Inicio: ${fmt(t, first.value)}`
                      : `Inicio: ${fmt(t, first.value)} · Ahora: ${fmt(t, last.value)}`}
                </span>
              </span>
              <span className="row">
                {logs.length > 1 && <Delta from={first.value} to={last.value} />}
                <IconChevron size={20} className="week-chevron" />
              </span>
            </button>
            {isOpen && (
              <>
                <Recorder
                  test={t}
                  tally={tallies[t.id] ?? { made: 0, total: 0 }}
                  setTally={(v) => setTallies((x) => ({ ...x, [t.id]: v }))}
                  onDone={() => {
                    setTallies((x) => ({ ...x, [t.id]: { made: 0, total: 0 } }))
                    setOpen(null)
                  }}
                />
                {logs.length > 0 && <History test={t} />}
              </>
            )}
          </section>
        )
      })}
    </main>
  )
}

interface Tally {
  made: number
  total: number
}

function fmt(t: ControlTest, v: number) {
  return t.outOf ? `${v} de ${t.outOf}` : `${v} ${v === 1 ? (t.unitOne ?? t.unit) : t.unit}`
}

function fmtDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('es', { day: 'numeric', month: 'short' })
}

/** Mediciones guardadas de una prueba, con opción de borrar una equivocada. */
function History({ test }: { test: ControlTest }) {
  const s = useAppState()
  const entries = s.measures.map((m, i) => ({ m, i })).filter(({ m }) => m.testId === test.id)
  return (
    <ul className="history">
      {entries.map(({ m, i }) => (
        <li key={i} className="row between small">
          <span>
            <span className="muted">{fmtDate(m.date)}</span> · {fmt(test, m.value)}
          </span>
          <button
            className="link"
            onClick={() => update((st) => ({ ...st, measures: st.measures.filter((_, j) => j !== i) }))}
            aria-label={`Borrar medición del ${fmtDate(m.date)}`}
          >
            Borrar
          </button>
        </li>
      ))}
    </ul>
  )
}

function Delta({ from, to }: { from: number; to: number }) {
  const d = to - from
  return <span className={`delta ${d > 0 ? 'up' : d < 0 ? 'down' : ''}`}>{d > 0 ? `+${d}` : d}</span>
}

function Recorder({
  test,
  tally,
  setTally,
  onDone,
}: {
  test: ControlTest
  tally: Tally
  setTally: (t: Tally) => void
  onDone: () => void
}) {
  const { made, total } = tally
  const [value, setValue] = useState('')

  function save(v: number) {
    update((st) => ({ ...st, measures: [...st.measures, { testId: test.id, date: today(), value: v }] }))
    onDone()
  }

  if (test.outOf) {
    const full = total >= test.outOf
    return (
      <div className="stack">
        <p className="muted small">Toca por cada bola: adentro del objetivo o afuera.</p>
        <div className="counter">
          <button className="primary big" disabled={full} onClick={() => (haptic(10), setTally({ made: made + 1, total: total + 1 }))}>
            Adentro
          </button>
          <button className="big" disabled={full} onClick={() => (haptic(6), setTally({ made, total: total + 1 }))}>
            Afuera
          </button>
        </div>
        <div className="counter-ring">
          <Ring value={total / test.outOf} size={84} stroke={7} color="var(--green)">
            <strong key={made} className="pop">{made}</strong>
          </Ring>
          <span className="muted small">
            adentro de {total} · {test.outOf - total === 1 ? 'falta' : 'faltan'} {test.outOf - total}
          </span>
        </div>
        <div className="row">
          <button className="primary" disabled={!full} onClick={() => save(made)}>
            Guardar
          </button>
          <button disabled={!total} onClick={() => setTally({ made: 0, total: 0 })}>
            Empezar de nuevo
          </button>
        </div>
      </div>
    )
  }

  const n = Number(value)
  return (
    <form
      className="row"
      onSubmit={(e) => {
        e.preventDefault()
        if (value !== '' && n >= 0) save(Math.round(n))
      }}
    >
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={test.unit}
        aria-label={test.unit}
      />
      <button className="primary" disabled={value === ''}>
        Guardar
      </button>
    </form>
  )
}
