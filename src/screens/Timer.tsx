import { useEffect, useRef, useState } from 'react'
import { IconPause, IconPlay, IconReset } from '../ui/icons'
import { Ring } from '../ui/Ring'
import { haptic } from '../ui/theme'

function beep(freq = 880) {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.value = freq
    g.gain.setValueAtTime(0.15, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
    o.connect(g).connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 0.25)
  } catch {
    // Sin audio disponible.
  }
  haptic(200)
}

function fmt(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`
}

/** Cuenta regresiva por series con descanso entre ellas. */
export function Timer({ seconds, sets = 1, rest = 30 }: { seconds: number; sets?: number; rest?: number }) {
  const [running, setRunning] = useState(false)
  const [set, setSet] = useState(1)
  const [resting, setResting] = useState(false)
  const [left, setLeft] = useState(seconds)
  const tick = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!running) return
    tick.current = window.setInterval(() => setLeft((l) => l - 1), 1000)
    return () => window.clearInterval(tick.current)
  }, [running])

  useEffect(() => {
    if (left > 0) return
    if (resting) {
      beep(1040)
      setResting(false)
      setLeft(seconds)
    } else if (set < sets) {
      beep(660)
      setSet(set + 1)
      setResting(true)
      setLeft(rest)
    } else {
      beep(1040)
      setRunning(false)
      setLeft(0)
    }
  }, [left, resting, set, sets, seconds, rest])

  const finished = !running && left === 0
  const total = resting ? rest : seconds
  function reset() {
    setRunning(false)
    setSet(1)
    setResting(false)
    setLeft(seconds)
  }

  return (
    <div className={`timer ${resting ? 'resting' : ''} ${running ? 'running' : ''}`}>
      <Ring
        value={finished ? 1 : left / total}
        size={92}
        stroke={8}
        color={resting ? 'var(--muted)' : 'var(--accent, var(--ball))'}
      >
        <span className="timer-time">{fmt(Math.max(0, left))}</span>
      </Ring>
      <div className="timer-side">
        <span className="timer-label">
          {finished ? '¡Listo! 🎾' : resting ? 'Descanso' : sets > 1 ? `Serie ${set} de ${sets}` : running ? 'En marcha' : 'Listo'}
        </span>
        {sets > 1 && (
          <span className="dots" aria-hidden>
            {Array.from({ length: sets }, (_, i) => (
              <i key={i} className={i < set - (resting || finished ? 0 : 1) || finished ? 'on' : ''} />
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
              <button className="pill-btn primary" onClick={() => (haptic(10), setRunning(!running))}>
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
