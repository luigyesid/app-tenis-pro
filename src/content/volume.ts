import type { Exercise, Level } from './types'

const factor: Record<Level, number> = { principiante: 0.7, intermedio: 1 }

/** Ajusta series, repeticiones y duración al nivel elegido al entrar. */
export function scaleVolume(ex: Exercise, level: Level) {
  const f = factor[level]
  return {
    sets: ex.sets ? Math.max(1, Math.round(ex.sets * f)) : undefined,
    reps: ex.reps ? Math.max(1, Math.round(ex.reps * f)) : undefined,
    seconds: ex.seconds ? roundSeconds(ex.seconds * f) : undefined,
  }
}

/** Bloques de 5 s hasta 1 min y de 15 s por encima, para que los tiempos se lean limpios. */
function roundSeconds(sec: number) {
  const step = sec >= 60 ? 15 : 5
  return Math.max(10, Math.round(sec / step) * step)
}

export function describeVolume(v: ReturnType<typeof scaleVolume>) {
  const parts: string[] = []
  if (v.sets) parts.push(`${v.sets} series`)
  if (v.reps) parts.push(`${v.reps} repeticiones`)
  if (v.seconds) parts.push(v.seconds >= 60 ? `${fmtMin(v.seconds)} min` : `${v.seconds} s`)
  return parts.join(' · ')
}

function fmtMin(sec: number) {
  const m = Math.floor(sec / 60)
  const r = sec % 60
  return r ? `${m}:${String(r).padStart(2, '0')}` : `${m}`
}
