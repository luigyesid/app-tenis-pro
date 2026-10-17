import { update, useAppState } from '../lib/store'
import { IconBack, IconStanding, IconWheelchair } from '../ui/icons'

export function Settings({ onClose }: { onClose: () => void }) {
  const s = useAppState()
  const p = s.profile!
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
        <button className="pill-btn" onClick={() => update((st) => ({ ...st, profile: undefined }))}>
          Cambiar
        </button>
      </div>
      <p className="muted small">Tu progreso se guarda en este celular. Código: {s.access?.code}</p>
    </main>
  )
}
