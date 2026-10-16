import { update, useAppState } from '../lib/store'

export function Settings({ onClose }: { onClose: () => void }) {
  const s = useAppState()
  const p = s.profile!
  return (
    <main className="screen">
      <button className="link back" onClick={onClose}>
        ← Volver
      </button>
      <h1 className="title">Tu perfil</h1>
      <div className="card stack">
        <p>
          Juegas <strong>{p.mode === 'pie' ? 'de pie' : 'en silla'}</strong>, nivel <strong>{p.level}</strong>.
        </p>
        <button onClick={() => update((st) => ({ ...st, profile: undefined }))}>Cambiar</button>
      </div>
      <p className="muted small">Tu progreso se guarda en este celular. Código: {s.access?.code}</p>
    </main>
  )
}
