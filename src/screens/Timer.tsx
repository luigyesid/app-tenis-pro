import { useEffect, useRef, useState } from 'react'
import { IconPause, IconPlay, IconReset } from '../ui/icons'
import { Ring } from '../ui/Ring'
import { haptic } from '../ui/theme'

// Un solo AudioContext para toda la app; se activa con el primer toque en "Iniciar" (requisito de iPhone).
let audio: AudioContext | null = null
function unlockAudio() {
  try {
    audio ??= new AudioContext()
    void audio.resume()
  } catch {
    // Sin audio disponible.
  }
}

function beep(freq = 880) {
  if (audio) {
    const o = audio.createOscillator()
    const g = audio.createGain()
    o.frequency.value = freq
    g.gain.setValueAtTime(0.15, audio.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.25)
    o.connect(g).connect(audio.destination)
    o.start()
    o.stop(audio.currentTime + 0.25)
  }
  haptic(200)
}

function fmt(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`
}

type Phase = { set: number; resting: boolean }

/** Cuenta regresiva por series con descanso entre ellas. Sigue bien aunque el celular bloquee la pantalla. */
export function Timer({ seconds, sets = 1, rest = 30 }: { seconds: number; sets?: number; rest?: number }) {
  const [phase, setPhase] = useState<Phase>({ set: 1, resting: false })
  const [left, setLeft] = useState(seconds)
  const [running, setRunning] = useState(false)
  // Momento (ms) en que termina la fase actual; así el tiempo no se atrasa si el celular duerme.
  const endAt = useRef(0)
  const wake = useRef<WakeLockSentinel | null>(null)
  const phaseRef = useRef(phase)

  useEffect(() => {
    if (!running) return
    const lock = async () => {
      try {
        wake.current = (await navigator.wakeLock?.request('screen')) ?? null
      } catch {
        // Sin bloqueo de pantalla disponible.
      }
    }
    void lock()

    const tick = () => {
      const remaining = Math.ceil((endAt.current - Date.now()) / 1000)
      if (remaining > 0) {
        setLeft(remaining)
        return
      }
      // Terminó la fase: pasa a descanso, a la siguiente serie o al final.
      const p = phaseRef.current
      let next: Phase | null
      let dur = 0
      if (p.resting) {
        beep(1040)
        next = { set: p.set, resting: false }
        dur = seconds
      } else if (p.set < sets) {
        beep(660)
        next = rest > 0 ? { set: p.set + 1, resting: true } : { set: p.set + 1, resting: false }
        dur = rest > 0 ? rest : seconds
      } else {
        beep(1040)
        next = null
      }
      if (next) {
        phaseRef.current = next
        setPhase(next)
        endAt.current = Date.now() + dur * 1000
        setLeft(dur)
      } else {
        setLeft(0)
        setRunning(false)
      }
    }
    const id = window.setInterval(tick, 250)
    const onVisible = () => document.visibilityState === 'visible' && (tick(), void lock())
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
      void wake.current?.release().catch(() => {})
      wake.current = null
    }
  }, [running, seconds, sets, rest])

  const finished = !running && left === 0
  const total = phase.resting ? rest : seconds
  const { set, resting } = phase

  function toggle() {
    haptic(10)
    if (running) {
      setRunning(false)
      return
    }
    unlockAudio()
    endAt.current = Date.now() + left * 1000
    setRunning(true)
  }

  function reset() {
    setRunning(false)
    phaseRef.current = { set: 1, resting: false }
    setPhase(phaseRef.current)
    setLeft(seconds)
  }

  const label = finished
    ? '¡Listo! 🎾'
    : resting
      ? 'Descanso'
      : sets > 1
        ? `Serie ${set} de ${sets}`
        : running
          ? 'En marcha'
          : left === seconds
            ? 'Preparado'
            : 'En pausa'

  return (
    <div className={`timer ${resting ? 'resting' : ''} ${running ? 'running' : ''}`}>
      <Ring
        value={finished ? 1 : total ? left / total : 1}
        size={92}
        stroke={8}
        color={resting ? 'var(--muted)' : 'var(--accent, var(--ball))'}
      >
        <span className="timer-time">{fmt(Math.max(0, left))}</span>
      </Ring>
      <div className="timer-side">
        <span className="timer-label" aria-live="polite">
          {label}
        </span>
        {sets > 1 && sets <= 30 && (
          <span className="dots" aria-hidden>
            {Array.from({ length: sets }, (_, i) => (
              <i key={i} className={finished || i < set - 1 ? 'on' : ''} />
            ))}
          </span>
        )}
        <div className="row">
          {finished ? (
            <button className="pill-btn" onClick={reset}>
              <IconReset size={18} /> Repetir
            </button>
          ) : (
            <>
              <button className="pill-btn primary" onClick={toggle}>
                {running ? <IconPause size={18} /> : <IconPlay size={18} />}
                {running ? 'Pausa' : 'Iniciar'}
              </button>
              <button className="icon-btn" onClick={reset} aria-label="Reiniciar">
                <IconReset size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
