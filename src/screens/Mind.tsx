import { useState } from 'react'
import { mindTools } from '../content/plan'
import { supportFor } from '../content/support'
import { today, update, useAppState, type DiaryEntry } from '../lib/store'

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
  const [all, setAll] = useState(false)
  // Entrada recién guardada: se muestra con su mensaje de apoyo abierto.
  const [fresh, setFresh] = useState<number | null>(null)

  function save(e: React.FormEvent) {
    e.preventDefault()
    const entry = { date: today(), good: good.trim(), improve: improve.trim(), rival: rival.trim() }
    if (!entry.good && !entry.improve && !entry.rival) return
    setFresh(s.diary.length)
    update((st) => ({ ...st, diary: [...st.diary, entry] }))
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
          .map((d, i) => ({ d, i }))
          .slice(all ? 0 : -3)
          .reverse()
          .map(({ d, i }) => (
            <Entry key={`${i}-${d.date}`} entry={d} index={i} open={fresh === i} onDeleted={() => setFresh(null)} />
          ))}
      {!writing && s.diary.length > 3 && (
        <button className="link center-self" onClick={() => setAll(!all)}>
          {all ? 'Ver menos' : `Ver todas (${s.diary.length})`}
        </button>
      )}
    </section>
  )
}

function Entry({
  entry: d,
  index,
  open,
  onDeleted,
}: {
  entry: DiaryEntry
  index: number
  open: boolean
  onDeleted: () => void
}) {
  const [confirm, setConfirm] = useState(false)
  const [showTip, setShowTip] = useState(open)
  const tips = supportFor(d)

  function remove() {
    update((st) => ({ ...st, diary: st.diary.filter((_, j) => j !== index) }))
    onDeleted()
  }

  return (
    <div className="entry small">
      <div className="row between">
        <span className="muted">{fmtDate(d.date)}</span>
        {confirm ? (
          <span className="row confirm">
            <span className="muted">¿Borrar?</span>
            <button className="pill-btn danger" onClick={remove}>
              Sí, borrar
            </button>
            <button className="pill-btn" onClick={() => setConfirm(false)}>
              No
            </button>
          </span>
        ) : (
          <button className="link" onClick={() => setConfirm(true)} aria-label={`Borrar entrada del ${fmtDate(d.date)}`}>
            Borrar
          </button>
        )}
      </div>
      {d.good && <p>✓ {d.good}</p>}
      {d.improve && <p>→ {d.improve}</p>}
      {d.rival && <p>◎ {d.rival}</p>}
      {showTip ? (
        <div className="support">
          <p className="eyebrow">Mensaje para ti</p>
          {tips.map((t) => (
            <div key={t.title} className="stack tight">
              <strong>{t.title}</strong>
              <p>{t.tip}</p>
            </div>
          ))}
        </div>
      ) : (
        <button className="link support-link" onClick={() => setShowTip(true)}>
          Ver mensaje para ti
        </button>
      )}
    </div>
  )
}

function fmtDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('es', { day: 'numeric', month: 'short' })
}
