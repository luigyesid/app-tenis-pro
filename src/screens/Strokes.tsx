import { useState } from 'react'
import { strokes } from '../content/plan'
import { today, update, useAppState } from '../lib/store'

export function Strokes() {
  const s = useAppState()
  const [strokeId, setStrokeId] = useState(strokes[0].id)
  const [made, setMade] = useState(0)
  const [total, setTotal] = useState(0)

  function save() {
    if (!total) return
    update((st) => ({ ...st, strokeLogs: [...st.strokeLogs, { date: today(), strokeId, made, total }] }))
    setMade(0)
    setTotal(0)
  }

  const logs = s.strokeLogs.filter((l) => l.strokeId === strokeId)
  const pct = (l: { made: number; total: number }) => Math.round((l.made / l.total) * 100)
  const first = logs[0]
  const last = logs[logs.length - 1]

  return (
    <main className="screen">
      <p className="eyebrow">Golpes</p>
      <h1 className="title">Mide tus golpes</h1>
      <div className="tabs-inline">
        {strokes.map((x) => (
          <button key={x.id} className={x.id === strokeId ? 'on' : ''} onClick={() => setStrokeId(x.id)}>
            {x.name}
          </button>
        ))}
      </div>

      <div className="card stack">
        <p className="muted small">Toca por cada pelota: dentro del objetivo o fuera.</p>
        <div className="counter">
          <button className="primary big" onClick={() => (setMade(made + 1), setTotal(total + 1))}>
            Dentro
          </button>
          <button className="big" onClick={() => setTotal(total + 1)}>
            Fuera
          </button>
        </div>
        <p className="center-text">
          <strong>{made}</strong> de {total}
          {total > 0 && ` · ${pct({ made, total })}%`}
        </p>
        <div className="row">
          <button className="primary" onClick={save} disabled={!total}>
            Guardar
          </button>
          <button onClick={() => (setMade(0), setTotal(0))} disabled={!total}>
            Borrar
          </button>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="card stack">
          {logs.length > 1 && (
            <p>
              Empezaste en <strong>{pct(first)}%</strong> y vas en <strong>{pct(last)}%</strong>.
            </p>
          )}
          <ul className="history">
            {logs
              .slice(-8)
              .reverse()
              .map((l, i) => (
                <li key={i} className="row between">
                  <span className="muted small">{l.date}</span>
                  <span>
                    {l.made}/{l.total} · {pct(l)}%
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </main>
  )
}
