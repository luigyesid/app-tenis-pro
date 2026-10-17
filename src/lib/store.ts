import { useSyncExternalStore } from 'react'
import type { Level, Mode } from '../content/types'

export interface Measure {
  testId: string
  date: string
  value: number
}

export interface DiaryEntry {
  date: string
  good: string
  improve: string
  rival: string
}

export interface AppState {
  access?: { code: string; validatedAt: string }
  profile?: { mode: Mode; level: Level }
  /** sessionId -> día en que se completó (YYYY-MM-DD). */
  done: Record<string, string>
  /** Pruebas de la tabla de control (semana 1 vs semana 8). */
  measures: Measure[]
  diary: DiaryEntry[]
  /** sessionId -> ejercicios marcados como hechos dentro de la sesión. */
  checked: Record<string, string[]>
  /** Semanas (4 y 8) en las que ya se pidió el testimonio. */
  testimonialAsked: number[]
  /** Día en que tocó "Ahora no"; la encuesta vuelve a salir otro día. */
  testimonialSnooze?: string
}

const KEY = 'tenispro:v2'
const empty: AppState = { done: {}, measures: [], diary: [], checked: {}, testimonialAsked: [] }

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty, ...JSON.parse(raw) } : empty
  } catch {
    return empty
  }
}

let state = load()
const listeners = new Set<() => void>()

export function update(fn: (s: AppState) => AppState) {
  state = fn(state)
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Sin almacenamiento (modo privado): la app sigue funcionando en memoria.
  }
  listeners.forEach((l) => l())
}

export function useAppState() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
  )
}

export function today(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
