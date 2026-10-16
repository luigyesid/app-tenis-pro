import { useEffect, useRef, useState } from 'react'

function beep() {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    o.frequency.value = 880
    o.connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 0.2)
    navigator.vibrate?.(200)
  } catch {
    // Sin audio disponible.
  }
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
    beep()
    if (resting) {
      setResting(false)
      setLeft(seconds)
    } else if (set < sets) {
      setSet(set + 1)
      setResting(true)
      setLeft(rest)
    } else {
      setRunning(false)
      setLeft(0)
    }
  }, [left, resting, set, sets, seconds, rest])

  const finished = !running && left === 0
  function reset() {
    setRunning(false)
    setSet(1)
    setResting(false)
    setLeft(seconds)
  }

  return (
    <div className={`timer ${resting ? 'resting' : ''}`}>
      <div className="timer-time">{fmt(Math.max(0, left))}</div>
      <div className="muted small">
        {finished ? '¡Listo!' : resting ? 'Descanso' : sets > 1 ? `Serie ${set} de ${sets}` : running ? 'En marcha' : 'Listo para empezar'}
      </div>
      <div className="row">
        {finished ? (
          <button onClick={reset}>Repetir</button>
        ) : (
          <button className="primary" onClick={() => setRunning(!running)}>
            {running ? 'Pausa' : 'Iniciar'}
          </button>
        )}
        {!finished && <button onClick={reset}>Reiniciar</button>}
      </div>
    </div>
  )
}
