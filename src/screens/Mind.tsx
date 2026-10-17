import { useState } from 'react'
import { mindTools } from '../content/plan'
import { today, update, useAppState } from '../lib/store'

export function Mind() {
  return (
    <main className="screen stagger">
      <div>
        <p className="eyebrow">Mente</p>
        <h1 className="title">Zona mental</h1>
      </div>
      <Diary />
      {mindTools.map((t) => (
        <section key={t.id} className="card stack mind-card">
          <h3>{t.title}</h3>
          {t.id === 'rutina' ? (
            <ol className="steps">
              {t.body.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ol>
          ) : (
            t.body.map((b) => <p key={b}>{b}</p>)
          )}
        </section>
      ))}
    </main>
  )
}

function Diary() {
  const s = useAppState()
  const [writing, setWriting] = useState(false)
  const [good, setGood] = useState('')
  const [improve, setImprove] = useState('')
  const [rival, setRival] = useState('')

  function save(e: React.FormEvent) {
    e.preventDefault()
    if (!good && !improve && !rival) return
    update((st) => ({ ...st, diary: [...st.diary, { date: today(), good, improve, rival }] }))
    setGood('')
    setImprove('')
    setRival('')
    setWriting(false)
  }

  return (
    <section className="card stack diary">
      <div className="row between">
        <h3>Diario del partido</h3>
        <span className="muted small">
          {s.diary.length} {s.diary.length === 1 ? 'entrada' : 'entradas'}
        </span>
      </div>
      {writing ? (
        <form className="stack" onSubmit={save}>
          <label className="stack tight">
            <span className="small">¿Qué hice bien?</span>
            <textarea rows={2} value={good} onChange={(e) => setGood(e.target.value)} />
          </label>
          <label className="stack tight">
            <span className="small">¿Qué voy a mejorar?</span>
            <textarea rows={2} value={improve} onChange={(e) => setImprove(e.target.value)} />
          </label>
          <label className="stack tight">
            <span className="small">¿Qué aprendí del rival?</span>
            <textarea rows={2} value={rival} onChange={(e) => setRival(e.target.value)} />
          </label>
          <div className="row">
            <button className="primary">Guardar</button>
            <button type="button" onClick={() => setWriting(false)}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="muted small">Después de cada partido o sesión, 3 preguntas. En 8 semanas vas a tener un mapa de tu juego.</p>
          <button className="primary" onClick={() => setWriting(true)}>
            Escribir hoy
          </button>
        </>
      )}
      {!writing &&
        s.diary
          .slice(-3)
          .reverse()
          .map((d, i) => (
            <div key={i} className="entry small">
              <span className="muted">{fmtDate(d.date)}</span>
              {d.good && <p>✓ {d.good}</p>}
              {d.improve && <p>→ {d.improve}</p>}
              {d.rival && <p>◎ {d.rival}</p>}
            </div>
          ))}
    </section>
  )
}

function fmtDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('es', { day: 'numeric', month: 'short' })
}
