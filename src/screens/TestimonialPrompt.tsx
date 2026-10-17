import { useState } from 'react'
import { submitTestimonial } from '../lib/supabase'
import { update, useAppState } from '../lib/store'
import { haptic } from '../ui/theme'

export function TestimonialPrompt({ week }: { week: number }) {
  const s = useAppState()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [name, setName] = useState('')
  const [canPublish, setCanPublish] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle')

  const close = () => update((st) => ({ ...st, testimonialAsked: [...st.testimonialAsked, week] }))

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) return
    setState('sending')
    try {
      await submitTestimonial({ code: s.access!.code, week, rating, comment, displayName: name, canPublish })
      close()
    } catch {
      setState('error')
    }
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="t-title">
      <form className="sheet stack" onSubmit={send}>
        <p className="eyebrow">{week === 8 ? '¡Terminaste el plan!' : 'Vas por la mitad'}</p>
        <h2 id="t-title">¿Cómo te ha ido en estas {week} semanas?</h2>
        <div className="stars" role="radiogroup" aria-label="Calificación">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} de 5`}
              className={n <= rating ? 'on' : ''}
              onClick={() => (haptic(8), setRating(n))}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="¿Qué mejoró en tu juego?"
          rows={3}
          maxLength={600}
        />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre y ciudad (opcional)" maxLength={80} />
        <label className="row check-label">
          <input type="checkbox" checked={canPublish} onChange={(e) => setCanPublish(e.target.checked)} />
          <span className="small">Luigy puede publicar mi comentario en la página y en Instagram.</span>
        </label>
        {state === 'error' && <p className="error">No se pudo enviar. Revisa tu conexión e inténtalo otra vez.</p>}
        <button className="primary" disabled={!rating || state === 'sending'}>
          {state === 'sending' ? 'Enviando…' : 'Enviar'}
        </button>
        <button type="button" className="link" onClick={close}>
          Ahora no
        </button>
      </form>
    </div>
  )
}
