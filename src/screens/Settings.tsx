import { useState } from 'react'
import { useAppState } from '../lib/store'
import { Onboarding } from './Onboarding'
import { IconBack, IconStanding, IconWheelchair } from '../ui/icons'

export function Settings({ onClose }: { onClose: () => void }) {
  const s = useAppState()
  const p = s.profile!
  const [editing, setEditing] = useState(false)
  if (editing) return <Onboarding onCancel={() => setEditing(false)} onDone={() => setEditing(false)} />
  return (
    <main className="screen stagger">
      <div className="session-head">
        <button className="icon-btn" onClick={onClose} aria-label="Volver">
          <IconBack size={22} />
        </button>
      </div>
      <h1 className="title">Tu perfil</h1>
      <div className="card profile">
        <span className="choice-icon">{p.mode === 'pie' ? <IconStanding size={28} /> : <IconWheelchair size={28} />}</span>
        <span className="stack tight">
          <strong>{p.mode === 'pie' ? 'De pie' : 'En silla'}</strong>
          <span className="muted small">Nivel {p.level}</span>
        </span>
        <button className="pill-btn" onClick={() => setEditing(true)}>
          Cambiar
        </button>
      </div>
      <p className="muted small">Tu progreso se guarda en este celular. Código: <span className="nowrap">{s.access?.code}</span></p>
    </main>
  )
}
