import { useState } from 'react'
import type { ControlTest } from '../content/types'
import type { Measure } from '../lib/store'

function fmtDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('es', { day: 'numeric', month: 'short' })
}

/** Barras de cada medición de una prueba, de la más vieja a la más nueva. La última va resaltada. */
export function TestChart({ test, logs }: { test: ControlTest; logs: Measure[] }) {
  const [active, setActive] = useState<number | null>(null)
  const shown = logs.slice(-6)
  const max = Math.max(test.outOf ?? 0, ...shown.map((m) => m.value), 1)
  const H = 96
  const unit = test.outOf ? `de ${test.outOf}` : test.unit

  return (
    <figure className="chart" aria-label={`Mediciones de ${test.name}`}>
      <div className="chart-plot" style={{ height: H + 22 }}>
        <span className="chart-grid base" style={{ bottom: 22 }} aria-hidden />
        <div className="chart-bars">
          {shown.map((m, i) => {
            const last = i === shown.length - 1
            const h = Math.max(4, (m.value / max) * H)
            return (
              <button
                key={`${m.date}-${i}`}
                className={`chart-bar ${last ? 'last' : ''} ${active === i ? 'on' : ''}`}
                onClick={() => setActive(active === i ? null : i)}
                aria-label={`${fmtDate(m.date)}: ${m.value} ${unit}`}
              >
                <span className="chart-value">{m.value}</span>
                <span className="chart-fill" style={{ height: h }} />
                <span className="chart-x">{fmtDate(m.date)}</span>
              </button>
            )
          })}
        </div>
      </div>
      <figcaption className="muted small">
        {active !== null
          ? `${fmtDate(shown[active].date)}: ${shown[active].value} ${unit}`
          : logs.length === 1
            ? 'Tu punto de partida. Repite la prueba en la semana 8 para comparar.'
            : `Toca una barra para ver el detalle${logs.length > 6 ? ' (últimas 6)' : ''}.`}
      </figcaption>
    </figure>
  )
}

/** Cambio desde la primera medición, en %, para comparar pruebas con unidades distintas. */
export function ProgressOverview({ tests, measures }: { tests: ControlTest[]; measures: Measure[] }) {
  const rows = tests
    .map((t) => {
      const logs = measures.filter((m) => m.testId === t.id)
      if (logs.length < 2) return null
      const first = logs[0].value
      const last = logs[logs.length - 1].value
      // Si empezó en 0, cualquier avance cuenta como +100%.
      const pct = first === 0 ? (last > 0 ? 100 : 0) : Math.round(((last - first) / first) * 100)
      return { t, first, last, pct }
    })
    .filter((r) => r !== null)

  const measured = tests.filter((t) => measures.some((m) => m.testId === t.id)).length
  if (rows.length === 0) {
    return (
      <section className="card stack overview">
        <strong>Tu progreso</strong>
        <p className="muted small">
          {measured === 0
            ? 'Cuando midas una prueba dos veces (semana 1 y semana 8) aquí verás cuánto mejoraste en cada una.'
            : `Llevas ${measured} de ${tests.length} pruebas medidas. Cuando repitas alguna, aquí verás tu mejora.`}
        </p>
      </section>
    )
  }

  const better = rows.filter((r) => r.pct > 0).length
  const span = Math.max(25, ...rows.map((r) => Math.abs(r.pct)))
  return (
    <section className="card stack overview">
      <div className="row between">
        <strong>Tu progreso</strong>
        <span className="muted small">
          Mejoraste en {better} de {rows.length}
        </span>
      </div>
      <p className="muted small">Cambio desde tu primera medición.</p>
      <ul className="diverge">
        {rows.map(({ t, pct }) => (
          <li key={t.id}>
            <span className="diverge-name">{t.name}</span>
            <span className="diverge-track" aria-hidden>
              <span className="diverge-zero" />
              <span
                className={`diverge-bar ${pct >= 0 ? 'up' : 'down'}`}
                style={{
                  width: `${(Math.abs(pct) / span) * 50}%`,
                  left: pct >= 0 ? '50%' : `${50 - (Math.abs(pct) / span) * 50}%`,
                }}
              />
            </span>
            <span className={`diverge-pct ${pct > 0 ? 'up' : pct < 0 ? 'down' : ''}`}>
              {pct > 0 ? '▲' : pct < 0 ? '▼' : '='} {pct > 0 ? `+${pct}` : pct}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
