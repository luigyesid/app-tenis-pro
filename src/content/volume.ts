import type { Exercise, Level } from './types'

const factor: Record<Level, number> = { principiante: 0.7, intermedio: 1 }

export interface Volume {
  sets?: number
  reps?: number
  per?: string
  seconds?: number
  rest?: number
}

/** Ajusta series, repeticiones y duración al nivel elegido al entrar. El e-book corresponde a intermedio. */
export function scaleVolume(ex: Exercise, level: Level): Volume {
  const f = ex.fixed ? 1 : factor[level]
  return {
    sets: ex.sets ? Math.max(1, Math.round(ex.sets * f)) : undefined,
    reps: ex.reps ? Math.max(1, Math.round(ex.reps * f)) : undefined,
    per: ex.per,
    seconds: ex.seconds ? (ex.fixed ? ex.seconds : roundSeconds(ex.seconds * f)) : undefined,
    rest: ex.rest,
  }
}

/** Bloques de 5 s hasta 1 min y de 15 s por encima, para que los tiempos se lean limpios. */
function roundSeconds(sec: number) {
  const step = sec >= 60 ? 15 : 5
  return Math.max(5, Math.round(sec / step) * step)
}

export function describeVolume(v: Volume) {
  const parts: string[] = []
  if (v.sets && v.sets > 1) parts.push(`${v.sets} series`)
  if (v.reps) parts.push(v.per ? `${v.reps} ${v.per}` : `${v.reps} repeticiones`)
  if (v.seconds) parts.push(v.seconds >= 60 ? `${fmtMin(v.seconds)} min` : `${v.seconds} s`)
  if (v.rest && v.sets && v.sets > 1) parts.push(`descanso ${v.rest} s`)
  // El número y su unidad no se separan, para que "30 s" no quede con la "s" sola en otra línea.
  return parts.map((x) => x.replace(/(\d) /g, '$1\u00a0')).join(' · ')
}

/** Minutos aproximados de una lista de ejercicios, para el resumen de "Hoy toca". */
export function estimateMinutes(list: Exercise[], level: Level) {
  const sec = list.reduce((acc, ex) => {
    const v = scaleVolume(ex, level)
    const sets = v.sets ?? 1
    const work = v.seconds ?? (v.reps ? v.reps * 4 : 120)
    return acc + sets * work + (sets - 1) * (v.rest ?? 30)
  }, 0)
  return Math.max(5, Math.round(sec / 60 / 5) * 5)
}

function fmtMin(sec: number) {
  const m = Math.floor(sec / 60)
  const r = sec % 60
  return r ? `${m}:${String(r).padStart(2, '0')}` : `${m}`
}
