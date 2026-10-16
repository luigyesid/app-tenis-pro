import { useSyncExternalStore } from 'react'
import type { Level, Mode } from '../content/types'

export interface StrokeLog {
  date: string
  strokeId: string
  made: number
  total: number
}

export interface AppState {
  access?: { code: string; validatedAt: string }
  profile?: { mode: Mode; level: Level }
  /** sessionId -> día en que se completó (YYYY-MM-DD). */
  done: Record<string, string>
  strokeLogs: StrokeLog[]
  /** Semanas (4 y 8) en las que ya se pidió el testimonio. */
  testimonialAsked: number[]
}

const KEY = 'tenispro:v2'
const empty: AppState = { done: {}, strokeLogs: [], testimonialAsked: [] }

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
