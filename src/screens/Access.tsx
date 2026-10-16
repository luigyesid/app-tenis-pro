import { useState } from 'react'
import { normalizeCode, redeemCode } from '../lib/supabase'
import { update } from '../lib/store'

const messages = {
  invalid: 'Ese código no es válido. Revisa el correo de tu compra en Hotmart.',
  offline: 'Necesitas internet la primera vez que entras. Después funciona sin conexión.',
  unconfigured: 'La app todavía no está conectada a la base de datos.',
}

export function Access() {
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setBusy(true)
    setError(null)
    const result = await redeemCode(code)
    setBusy(false)
    if (result === 'ok') {
      update((s) => ({ ...s, access: { code: normalizeCode(code), validatedAt: new Date().toISOString() } }))
    } else {
      setError(messages[result])
    }
  }

  return (
    <main className="screen center">
      <div className="brand">
        <span className="ball" aria-hidden />
        <h1>TENIS PRO</h1>
        <p className="muted">8 semanas · Luigy Nieves</p>
      </div>
      <form className="card stack" onSubmit={submit}>
        <label htmlFor="code">Código de acceso</label>
        <p className="muted small">Lo recibiste en tu correo al comprar el pack en Hotmart.</p>
        <input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="TP-XXXX-XXXX"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
        />
        {error && <p className="error">{error}</p>}
        <button className="primary" disabled={busy}>
          {busy ? 'Revisando…' : 'Entrar'}
        </button>
      </form>
      <p className="muted small center-text">
        ¿No tienes código? Consigue el pack en Hotmart o escribe a Luigy por Instagram:{' '}
        <a href="https://instagram.com/luigynieves">@luigynieves</a>
      </p>
    </main>
  )
}
