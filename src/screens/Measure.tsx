import { useState } from 'react'
import { controlTests } from '../content/plan'
import type { ControlTest } from '../content/types'
import { today, update, useAppState } from '../lib/store'

export function Measure() {
  const s = useAppState()
  const [open, setOpen] = useState<string | null>(null)

  return (
    <main className="screen">
      <p className="eyebrow">Medir</p>
      <h1 className="title">Tabla de control</h1>
      <p className="muted">Haz estas pruebas en la semana 1 y repítelas en la semana 8. Lo que no se mide, no mejora.</p>
      {controlTests.map((t) => {
        const logs = s.measures.filter((m) => m.testId === t.id)
        const first = logs[0]
        const last = logs[logs.length - 1]
        const isOpen = open === t.id
        return (
          <section key={t.id} className="card stack">
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
              {logs.length > 1 && <Delta from={first.value} to={last.value} />}
            </button>
            {isOpen && <Recorder test={t} onDone={() => setOpen(null)} />}
          </section>
        )
      })}
    </main>
  )
}

function fmt(t: ControlTest, v: number) {
  return t.outOf ? `${v} de ${t.outOf}` : `${v} ${t.unit}`
}

function Delta({ from, to }: { from: number; to: number }) {
  const d = to - from
  return <span className={`delta ${d > 0 ? 'up' : d < 0 ? 'down' : ''}`}>{d > 0 ? `+${d}` : d}</span>
}

function Recorder({ test, onDone }: { test: ControlTest; onDone: () => void }) {
  const [made, setMade] = useState(0)
  const [total, setTotal] = useState(0)
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
          <button className="primary big" disabled={full} onClick={() => (setMade(made + 1), setTotal(total + 1))}>
            Adentro
          </button>
          <button className="big" disabled={full} onClick={() => setTotal(total + 1)}>
            Afuera
          </button>
        </div>
        <p className="center-text">
          <strong>{made}</strong> de {total} · faltan {test.outOf - total}
        </p>
        <div className="row">
          <button className="primary" disabled={!full} onClick={() => save(made)}>
            Guardar
          </button>
          <button disabled={!total} onClick={() => (setMade(0), setTotal(0))}>
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
